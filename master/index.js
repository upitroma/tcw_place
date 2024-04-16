const express = require('express');

const PORT = 3000

const MAX_X = 320
const MAX_Y = 180

var canvas = new Array(MAX_X).fill(0).map(() => new Array(MAX_Y).fill("#000000"));

var app = express();

//static website to view the canvas
app.use(express.json())

//performance logging
// app.use(require('express-status-monitor')());


// update array of pixels
// pixelChangeCache.push([x,y,color])
app.post("/update", function(req, res) {
    console.log(req.body)
    res.setHeader('Content-Type', 'application/json');

    pixelChangeCache = req.body
    pixelChangeCache.forEach(element => {
        canvas[element[0]][element[1]] = element[2]
    });

    res.status(200)
    res.send({"msg":"OK"})
})

app.get("/get", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"canvas":canvas})
});

var server = app.listen(PORT, function () {
    console.log("Server is running!")
})
