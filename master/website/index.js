document.getElementById("message").innerHTML="Call the api to edit the canvas! <br><code>"+window.location.href+"change?x=5&y=10&col=ff0000 </code>"
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d');

const MAX_X = 320
const MAX_Y = 180

//handle resize
function resizeCanvas(){
    const aspectRatio = 16/9
    const margin = 100
    let width=window.innerWidth;
    let height=window.innerHeight

    //find limiting factor
    if((width/height)<aspectRatio){
        canvas.width = window.innerWidth-margin;
        canvas.height = canvas.width/aspectRatio;
    }
    else{
        canvas.height = window.innerHeight-margin
        canvas.width = canvas.height*aspectRatio
    }
    render()
}
window.onresize = resizeCanvas;

//fetch data from api
var apiData
async function getData(){
    url = window.location.href+"get"
    req = await fetch(url)
    res = await req.json()
    return res
}

function drawPixel(x,y,col){
    //must be the same as server side
    

    ctx.fillStyle = col
    ctx.fillRect(
        x*(canvas.width/MAX_X),
        y*(canvas.height/MAX_Y),
        (canvas.width/MAX_X)+1, //plus 1 to prevent aliasing
        (canvas.height/MAX_Y)+1
    )
    // canvas.width/MAX_X and canvas.height/MAX_Y should be equal, but floating point errors exist
}

async function render(){
    data = await getData()    
    for(x=0;x<MAX_X;x++){
        for(y=0;y<MAX_Y;y++){
            drawPixel(x,y,data.canvas[x][y])
        }
    }
}
setInterval(render,2000);
resizeCanvas()
