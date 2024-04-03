const express = require('express');
const sha256 = require('js-sha256');

const PORT = 3000

const MAX_X = 320
const MAX_Y = 180

const FLAG = "bsftw{YxqY3FKJu9EoebEKqENDSpAyVA9pyyTS}"

const SERVER_SECRET = generateRandomString(32)

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

console.log("Server secret: "+SERVER_SECRET)

function generateRandomHexColor() {
    return Math.floor(Math.random()*16777215).toString(16);
}

function getHash(secret,color){
    return sha256(secret+color)
}

function validateWinCondition(secret,token,color){

    if (sha256(secret+color)!=token){
        return "Invalid token or color!"
    }
    // if canvas is 90% filled with the color
    let count = 0
    for (let i = 0; i < MAX_X; i++) {
        for (let j = 0; j < MAX_Y; j++) {
            if(canvas[i][j]=="#"+color){
                count++
            }
        }
    }
    if((count/(MAX_X*MAX_Y))<0.9){
        return "Not enough pixels filled with your color! "+ (count/(MAX_X*MAX_Y)).toString()
    }

    return FLAG

}


// networking / game logic
var canvas = new Array(MAX_X).fill(0).map(() => new Array(MAX_Y).fill("#000000"));

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
    canvas[x][y]=color
    
    res.status(200)
    res.send({"msg":"OK"})
});

app.get("/get", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"canvas":canvas})
});

app.get("/newColor", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let color = generateRandomHexColor()
    res.send({
        "color":color,
        "token":getHash(SERVER_SECRET,color)
    })
});

app.get("/validate", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "flag":validateWinCondition(SERVER_SECRET,req.query.token,req.query.color)
    })
});


var server = app.listen(PORT, function () {
    console.log("Server is running!")
})
