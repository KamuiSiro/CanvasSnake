const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var snakeSize = 2;
const initialSnakeX = width-20;
const initialSnakeY = height/2;

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}  

function randomRGB() {

    var color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
    if (color === 'rgb(255,0,0)') color = randomRGB();
    return color;
}


class Food {

    constructor(x, y, color, size) {

        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.exists = true;
        this.snakeDots = [];
    }
    checkBounds() {

        if (this.x + this.size >= width) {
          this.x -= this.size;
        }
      
        if (this.x - this.size <= 0) {
          this.x += this.size;
        }
      
        if (this.y + this.size >= height) {
          this.y -= this.size;
        }
      
        if (this.y - this.size <= 0) {
          this.y += this.size;
        }     
    };
    
    draw() {
        
        ctx.beginPath();
        ctx.fillStyle = this.color;
        if (this.x + this.size >= width) this.x -= this.size;
        if (this.x - this.size <= 0) this.x += this.size;
        if (this.y + this.size >= height) this.y -= this.size;
        if (this.y - this.size <= 0) this.y += this.size;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };

    catchDetect() {
        
        if (!(this === snakeHead)) {
            var dx = this.x - snakeHead.x;
            var dy = this.y - snakeHead.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
      
            if (distance < this.size + snakeHead.size) {
                this.exists = false;
                snakeSize++;
            }
        }
    };
}

class Snake extends Food {

    constructor(head, length) {

        super(initialSnakeX, initialSnakeY, "red", 10);
        this.length = length;
        this.head = head;
        this.moveTo = 0;
        this.speed = 4;


        window.addEventListener('keydown', (e) => {
            switch (e.key) {
              case 'a':
                this.moveTo = 4; //west
                break;
              case "d":
                this.moveTo = 2; //east
                break;
              case "s":
                this.moveTo = 3; //south
                break;
              case "w":
                this.moveTo = 1; //north
                break;
            }
          });
    }

    drawSnake() {
        
        
        ctx.beginPath();
        ctx.fillStyle = "red";
        for (var i = 0; i < length; i++) {

            var dot = new Food(this.x, this.y, "red", 10);
            snakeDots.push(dot);            
        }
        for (var body of snakeDots) {
            if (this.x + this.size >= width) this.x -= this.size;
            if (this.x - this.size <= 0) this.x += this.size;
            if (this.y + this.size >= height) this.y -= this.size;
            if (this.y - this.size <= 0) this.y += this.size;
            ctx.arc(body.x, body.y, 10, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    move() {
        
        if (this.moveTo === 4) {
            
            this.x -= this.speed;
            this.drawSnake();
        }
        
        if (this.moveTo === 2) {

            this.x += this.speed;
            this.drawSnake();
        }

        if (this.moveTo === 1) {

            this.y -= this.speed;
            this.drawSnake();
        }

        if (this.moveTo === 3) {

            this.y += this.speed;
            this.drawSnake();
        }
    }

}

const snakeHead = new Food(random(0 + 10, width - 10), random(0 + 10, height - 10), "red", 10);
var food = new Food(random(0 + 10, width - 10), random(0 + 10, height - 10), randomRGB(), 10);
var snake = new Snake(snakeHead, snakeSize);

function game() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
    food.draw();
    if (snake.moveTo === 0) {
        snake.draw();        
    }
    else {
        snake.move();
    }
    requestAnimationFrame(game);
}
game();
