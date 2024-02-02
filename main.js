const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var snakeSize = 1;
var snakeBody = [];
var initialSnakeX = width-20;
var initialSnakeY = 20;
var init = true;
var snakeSpeed = 3;

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}  

function randomRGB() {

    var color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
    if (color === 'rgb(255,0,0)') color = randomRGB();
    return color;
}
class Dot {

    constructor (x, y, color) {

        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 10;
    }

    draw() {

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };
}

class Food  extends Dot {

    constructor(x, y, color) {

        super(x, y, color);
        this.exists = true;
    }

    catchDetect() {
        
        var dx = this.x - snakeBody[0].x;
        var dy = this.y - snakeBody[0].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + snakeBody[0].size) {
            this.exists = false;
            snakeSize++
            var tmp = snake.moveTo;
            snake = new Snake(snakeSize, snakeSpeed);
            snake.moveTo = tmp;
        }
    };
}

class Snake extends Dot {

    constructor(length, speed) {

        super(initialSnakeX, initialSnakeY, "red");
        this.length = length;
        this.moveTo;
        this.speed = speed;
        this.end = true;


        window.addEventListener('keydown', (e) => {

            switch (e.key) {
              case 'a':
                this.moveTo = 4; //west
                init = false;
                break;
              case "d":
                this.moveTo = 2; //east
                init = false;
                break;
              case "s":
                this.moveTo = 3; //south
                init = false;
                break;
              case "w":
                this.moveTo = 1; //north
                init = false;
                break;
            }
          });
    }

    drawSnake() {

        var tmp = this.y;
        for (var i = this.length; i>0; i--) {

            var dot = new Dot(this.x, tmp, this.color);
            tmp += this.size*2;
            snakeBody.push(dot);
        }
        for (var dots of snakeBody) dots.draw();
    }

    move() {
        
        if (this.moveTo === 4) {
            
            for (var i = this.length; i >= 0; i-- ) {

                if (i === 0) {
                    snakeBody[i].x -= this.speed;
                }
                else {
                    snakeBody[i].x = snakeBody[i-1].x;
                    snakeBody[i].y = snakeBody[i-1].y;
                } 
                snakeBody[i].draw();
            }
        }
        
        if (this.moveTo === 2) {

            for (var i = this.length; i >= 0; i-- ) {

                if (i === 0) {
                    snakeBody[i].x += this.speed;
                }
                else {
                    snakeBody[i].x = snakeBody[i-1].x;
                    snakeBody[i].y = snakeBody[i-1].y;
                } 
                snakeBody[i].draw();
            }
        }

        if (this.moveTo === 1) {

            for (var i = this.length; i >= 0; i-- ) {

                if (i === 0) {
                    snakeBody[i].y -= this.speed;
                }
                else {
                    snakeBody[i].x = snakeBody[i-1].x;
                    snakeBody[i].y = snakeBody[i-1].y;
                } 
                snakeBody[i].draw();
            }
        }

        if (this.moveTo === 3) {

            for (var i = this.length; i >= 0; i-- ) {

                if (i === 0) {
                    snakeBody[i].y += this.speed;
                }
                else {
                    snakeBody[i].x = snakeBody[i-1].x;
                    snakeBody[i].y = snakeBody[i-1].y;
                } 
                snakeBody[i].draw();
            }
        };
    };

    crashDetect() {
        
        var crashX = snakeBody[0].x - this.size;
        var crashY = snakeBody[0].y - this.size;
        if (crashX <= 0 || crashX >= width || crashY <= 0 || crashY >= height) this.end = false;
    }

}

var snake = new Snake(snakeSize, snakeSpeed);
var food = new Food(random(0 + 10, width - 10), random(0 + 10, height - 10), randomRGB(), 10);


function game() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
    if (food.exists) {
        food.draw();
    }
    else food = new Food(random(0 + 10, width - 10), random(0 + 10, height - 10), randomRGB(), 10);
    if (init) {
        snake.drawSnake();        
    }
    else {
        snake.move();
    }
    food.catchDetect();
    snake.crashDetect();
    var go = requestAnimationFrame(game);
    if (!snake.end) {
        alert("Game over. Your score is " + (snakeSize-1));
        snakeBody.length = 0;
        snake.moveTo = undefined;
        cancelAnimationFrame(go);
        location.reload();
    }
}
game();

function speedUp() {
    snakeSpeed = snakeSpeed*2;
    snake = new Snake(snakeSize, snakeSpeed);
}
setInterval(speedUp, 60*1000);
