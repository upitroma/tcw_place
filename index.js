const express = require('express');
const redis = require('redis');

const PORT = 3000
const REDIS_IP = "172.17.0.2"

const MAX_X = 4000
const MAX_Y = 3000

var app = express();

const client = redis.createClient({
    url: `redis://${REDIS_IP}`,
    port: '6379'
});

client.connect()

client.on('error', err => {
    console.log('Redis client err ' + err);
});
client.on('connect', function() {
    console.log('Connected to redis!');
});

//static website to view the canvas
app.use(express.static('website'))

//change a pixel
//http://localhost:3000/change?x=5&y=10&col=3
app.get("/change", function(req, res) {
    res.send("x="+req.query.x+" y="+req.query.y+" col="+req.query.col)
    client.set("x",req.query.x)
});

app.get("/get", async function(req, res) {

    try{
        let x = await client.get("x")
        res.send(x)

    }catch(err){
        console.error(err);
        res.status(500);
        res.send("err")
    }

    // res.send("this will get the current data from redis. If a screenshot key is passed, return the data from that key instead")
});

app.get("/screenshot", function(req, res) {
    res.send("this will save a snapshot of the current data, save it with a unique key, then return the key")
});

var server = app.listen(PORT, function () {
    console.log("Server is running!")
 })