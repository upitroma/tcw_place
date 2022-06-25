const express = require('express');
const redis = require('redis');

const PORT = 3000

const MAX_X = 160
const MAX_Y = 90

var canvas = new Array(MAX_X).fill(0).map(() => new Array(MAX_Y).fill("#ffffff"));

var app = express();

//static website to view the canvas
app.use(express.static('website'))

//change a pixel
//http://localhost:3000/change?x=5&y=10&col=3
app.get("/change", function(req, res) {

    //TODO: validate params

    //validate color
    // console.log(req.query.col)
    let color = "#"+req.query.col;
    console.log(color)
    // if(CSS.supports('color',color)){
    //     res.send('{"msg":"ERR: invalid color. Please use color hex codes. ex: ff00ff"}')
    //     return
    // }

    let x = parseInt(req.query.x)
    let y = parseInt(req.query.y)

    canvas[x][y]=color
    res.setHeader('Content-Type', 'application/json');
    res.send({"msg":"OK"})
});

app.get("/get", async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"canvas":canvas})
    // res.send("this will get the current data from redis. If a screenshot key is passed, return the data from that key instead")
});

app.get("/screenshot", function(req, res) {
    res.send("this will save a snapshot of the current data, save it with a unique key, then return the key")
});

var server = app.listen(PORT, function () {
    console.log("Server is running!")
 })