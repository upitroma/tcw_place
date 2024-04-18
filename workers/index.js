const express = require('express');

const PORT = 3000

const MAX_X = 320
const MAX_Y = 180

var canvas = new Array(MAX_X).fill(0).map(() => new Array(MAX_Y).fill("#000000"));

var pixelChangeCache=[]

var app = express();

//static website to view the canvas
app.use(express.static('website'))

//performance logging
app.use(require('express-status-monitor')());

//change a pixel
//http://localhost:3000/change?x=5&y=10&col=ff0000
app.get("/change", function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    //check for missing argument
    if(!(req.query.x && req.query.y && req.query.col)){
        res.status(400)
        msg="ERROR: missing argument. Valid example: /change?x=5&y=10&col=ff0000 "
        res.send({"msg":msg})
        return
    }

    //validate coords
    if(!(Number.isInteger(Number(req.query.x)) && Number.isInteger(Number(req.query.y)))){
        res.status(400)
        msg="ERROR: x and y must be integers. Valid example: /change?x=5&y=10&col=ff0000 "
        res.send({"msg":msg})
        return
    }
    if(req.query.x>=MAX_X || req.query.x<0){
        res.status(400)
        msg=`ERROR: x must be between 0 and ${MAX_X-1}. Valid example: /change?x=5&y=10&col=ff0000 `
        res.send({"msg":msg})
        return
    }
    if(req.query.y>=MAX_Y || req.query.y<0){
        res.status(400)
        msg=`ERROR: y must be between 0 and ${MAX_Y-1}. Valid example: /change?x=5&y=10&col=ff0000 `
        res.send({"msg":msg})
        return
    }

    //validate color
    let regex=/[0-9a-f]{6}/g
    if(!regex.test(req.query.col)){
        res.status(400)
        msg=`ERROR: col must contain exactly 6 hex characters. Valid example: /change?x=5&y=10&col=ff0000 `
        res.send({"msg":msg})
        return
    }

    //all checks have passed

    let color = "#"+req.query.col;
    let x = parseInt(req.query.x)
    let y = parseInt(req.query.y)
    // canvas[x][y]=color

    pixelChangeCache.push([x,y,color])
    
    res.status(200)
    res.send({"msg":"OK"})
});

app.get("/get", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"canvas":canvas})
});

var server = app.listen(PORT, function () {
    console.log("Server is running!")
 })


// sync with master node
async function syncToMaster() {

    try{

        // send pixelChangeCache array to master
        await fetch("http://master:3000/update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pixelChangeCache)
        })
        .then(res => res.json())
        .then(data => {
            pixelChangeCache = []
        })


        // get new canvas from master
        req = await fetch("http://master:3000/get")
        res = await req.json()
        canvas = res.canvas
    }
    catch(e){
        syncToMaster()
    }
}

setInterval(syncToMaster, 1000)