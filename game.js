var canvas,ctx,keystate;
var WIDTH = 600;
var HEIGHT = 600;

// Player1 move arrows

var pl1_up = 87;
var pl1_down = 83;

// Player1 move arrows

var pl2_up = 38;
var pl2_down = 40;

var player1 = {
    x: null,
    y: null,
    width: 10,
    height: 100,
    score: 0,

    update: function(){
        if( keystate[pl1_up] && this.y > 0){
            this.y -= 5;
        }
        if( keystate[pl1_down] && this.y + this.height < HEIGHT){
            this.y += 5;
        }
    },
    draw: function(){
        ctx.fillStyle = "#fff";
        ctx.fillRect( this.x, this.y, this.width, this.height );
        ctx.font = "25px Arial";
        ctx.fillText(this.score, 200, 100);
    }
};
var player2 = {
    x: null,
    y: null,
    width: 10,
    height: 100,
    score: 0,
    
    update: function(){
        if( keystate[pl2_up] && this.y > 0){
            this.y -= 5;
        }
        if( keystate[pl2_down] && this.y + this.height < HEIGHT){
            this.y += 5;
        }
    },
    draw: function(){
        ctx.fillStyle = "#fff";
        ctx.fillRect( this.x, this.y, this.width, this.height );

        ctx.font = "25px Arial";
        ctx.fillText(this.score, WIDTH-200, 100);
    }
};
var ball = {
    x: null,
    y: null,
    vel: null,
    clr: "#fff",
    side: 15,
    speed: 10,
    
    update: function(){
        this.x += this.vel.x;
        this.y += this.vel.y;

        if( this.y < 0 || this.y + this.side > HEIGHT ){
            this.vel.y *= -1;
        }

        var makeMatch = function(ax,ay,aw,ah,bx,by,bw,bh){
            return ax<bx+bw && ay<by+bh && bx<ax+aw && by<ay+ah;
        };

        var ballDir = this.vel.x < 0 ? player1 : player2;

        if( makeMatch( ballDir.x , ballDir.y , ballDir.width , ballDir.height , this.x , this.y, this.side, this.side ) ){
            var n = ( this.y + this.side - ballDir.y ) / ( ballDir.height + this.side );
            var phi = 0.25 * Math.PI * ( 2 * n - 1 );
            this.vel.x = ( ballDir === player1 ? 1 : -1) * this.speed * Math.cos(phi);
            this.vel.y = ( ballDir === player1 ? 1 : -1) * this.speed * Math.sin(phi);
        }

        if( this.x + this.side < 0 || this.x > WIDTH ){
            ball.x = ( WIDTH - ball.side ) / 2;
            ball.y = ( WIDTH - ball.side ) / 2;
        
            ball.vel = {
                x: ( ballDir === player1 ? 1 : -1) * ball.speed,
                y: 0
            }

            ballDir === player1 ? player2.score++ : player1.score++;

            this.clr = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
        }
    },
    draw: function(){
        ctx.fillStyle = this.clr;
        ctx.fillRect( this.x, this.y, this.side, this.side );
    }
};

function startGame(){
    createCanvas();
    initializeElenmets();

    keystate = {};

    document.addEventListener( "keydown" , function(evt){
        keystate[evt.keyCode] = true;
    });
    document.addEventListener( "keyup" , function(evt){
        delete keystate[evt.keyCode];
    });

    var loop = function(){
        updateElements();
        drawElements();

        window.requestAnimationFrame(loop,canvas);
    };

    window.requestAnimationFrame(loop,canvas);
}
function createCanvas(){
    var canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    ctx = canvas.getContext("2d");

    document.getElementsByTagName("body")[0].prepend(canvas);
}
function initializeElenmets(){

    // Initialize Player 1
    
    player1.x = player1.width;
    player1.y = ( HEIGHT - player1.height ) / 2;

    // Initialize Player 2
    
    player2.x = WIDTH - ( player1.width + player2.width );
    player2.y = ( HEIGHT - player2.height ) / 2;

    // Initialize Ball

    ball.x = ( WIDTH - ball.side ) / 2;
    ball.y = ( WIDTH - ball.side ) / 2;

    ball.vel = {
        x: ball.speed,
        y: 0
    }
}
function updateElements(){
    player1.update();
    player2.update();
    ball.update();
}
function drawElements(){

    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.save();
    ctx.fillStyle = "rgb(255, 255, 255)";

    player1.draw();
    player2.draw();
    ball.draw();

    var w = 3;
    var x = ( WIDTH - w ) / 2;

    var y = -30;
    var st = HEIGHT/5;

    while( y < HEIGHT ){
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(x , y+(st/2) , w , st/2);
        
        y += st;
    }

    ctx.restore();
}
function drawLine(){
}

startGame();