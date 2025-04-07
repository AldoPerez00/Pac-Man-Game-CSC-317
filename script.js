document.body.style.zoom = "120%";
let gamePiece; // Pac-Man character
let wallOne;
const SPEED = 3; // Fixed speed constant for Pac-Man
const GHOST_SPEED = 2
let walls = [];

function startGame() {
    gameArea.start();

    // Wall Objects
    wallOne = new Obstacle(0, 50, 450,25, "black")
    wallTwo = new Obstacle(550, 50, 650,25, "black")
    wallThree = new Obstacle(1024/28, 527/2 , 950,25, "black")
    wallFour = new Obstacle(0, 450, 450,25, "black")
    wallFive = new Obstacle(550, 450, 650,25, "black")

    // Border Sides
    BorderSide = new Obstacle(-10, 0, 10, window.innerHeight/2, "black")
    BorderSide2 = new Obstacle(1024, 0, 10, window.innerHeight/2, "black")
    BorderSide3 = new Obstacle(0, -10, window.innerWidth, 10, "black")
    BorderSide4 = new Obstacle(0, 527, window.innerWidth, 10, 10, "black")

    // Fruits

    fruits = [
        new Component(15, 15, "red", 200, 200, []),
        new Component(15, 15, "red", 300, 300, []),
        new Component(15, 15, "red", 400, 100, []),
        new Component(15, 15, "red", 700, 100, []),
        new Component(15, 15, "red", 300, 250, []),
        new Component(15, 15, "red", 400, 300, []),
        new Component(15, 15, "red", 700, 400, []),
        new Component(15, 15, "red", 700, 300, []),
        new Component(15, 15, "red", 400, 400, [])
    ];

    ghosts = [
        new Component(25, 25, "blue", 300, 300, []),
        new Component(25, 25, "pink", 400, 200, []),
        new Component(25, 25, "orange", 500, 400, [])
        ]


    // Creating this in a list so its easier to go through it instead of going one by one
    // I coudlve just made the objects in here remember for next time
    walls = [
        {x: wallOne.x, y: wallOne.y, width: wallOne.width, height: wallOne.height},
        {x: wallTwo.x, y: wallTwo.y, width: wallTwo.width, height: wallTwo.height},
        {x: wallThree.x, y: wallThree.y, width: wallThree.width, height: wallThree.height},
        {x: wallFour.x, y: wallFour.y, width: wallFour.width, height: wallFour.height},
        {x: wallFive.x, y: wallFive.y, width: wallFive.width, height: wallFive.height},
        {x: BorderSide.x, y: BorderSide.y, width: BorderSide.width, height: BorderSide.height},
        {x: BorderSide2.x, y: BorderSide2.y, width: BorderSide2.width, height: BorderSide2.height},
        {x: BorderSide3.x, y: BorderSide3.y, width: BorderSide3.width, height: BorderSide3.height},
        {x: BorderSide4.x, y: BorderSide4.y, width: BorderSide4.width, height: BorderSide4.height},
    ]
    gamePiece = new Component(25, 25, "yellow", 10, 10, walls);

    gamePiece.direction = null; // tack direction to ensure one way movement
}

let gameArea = {
    canvas: document.createElement("canvas"),
    start() {
        this.canvas.width = window.innerWidth / 2;
        this.canvas.height = window.innerHeight / 2;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        // Handle key presses to set direction
        window.addEventListener("keydown", (event) => {
            this.key = event.key;
        });
        window.addEventListener("keyup", () => {
            this.key = false;
        });
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}, fruit;

function checkFruitCollision() {
    for (let i = 0; i < fruits.length; i++) {
        let fruit = fruits[i];

        if (gamePiece.x < fruit.x + fruit.width && gamePiece.x + gamePiece.width > fruit.x && gamePiece.y < fruit.y + fruit.height && gamePiece.y + gamePiece.height > fruit.y) {
            fruits.splice(i, 1); // the second input is to decide how many to delete
            break;
        }
    }
}

window.onload = function() {
    document.getElementById('zoom-instructions').style.display = "block";
};

function Obstacle(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.update = function () {
        const ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


function Component(width, height, color, x, y, others) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.others = others;
    this.direction = null; // Current movement direction
    this.noForward = function () {
        for (let i = 0; i < this.others.length; i++) {
            let other = this.others[i];

            let otherLeft = other.x;
            let otherRight = other.x + other.width;
            let otherTop = other.y;
            let otherBottom = other.y + other.height;

            let nextX = this.x;
            let nextY = this.y;

            // Predict next position based on direction
            if (this.direction === "up") {
                nextY -= SPEED;
            }
            if (this.direction === "down") {
                nextY += SPEED;
            }
            if (this.direction === "left") {
                nextX -= SPEED;
            }
            if (this.direction === "right") {
                nextX += SPEED;
            }

            // Check if next move will cause collision
            if (nextX < otherRight && nextX + this.width > otherLeft && nextY < otherBottom && nextY + this.height > otherTop) {
                if (this.direction === "up") {
                    this.y = otherBottom; //
                } else if (this.direction === "down") {
                    this.y = otherTop - this.height;
                } else if (this.direction === "left") {
                    this.x = otherRight;
                } else if (this.direction === "right") {
                    this.x = otherLeft - this.width;
                }
                return true;
            }
        }
        return false;

    };
    this.update = function() {
        const ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.newPosition = function() {
        if (!this.noForward()) { // Only move if no collision detected
            if (this.direction === "up") {
                this.y -= SPEED;
            }
            if (this.direction === "down") {
                this.y += SPEED;}
            if (this.direction === "left") {
                this.x -= SPEED
            }
            if (this.direction === "right") {
                this.x += SPEED
            }
        }
    };
}
function moveGhost(ghost) {
    const directions = ["up", "down", "left", "right"];
    if (Math.random() < 0.02) { // Change direction occasionally
        ghost.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    if (ghost.direction === "up") {
        ghost.y -= GHOST_SPEED;
    }
    if (ghost.direction === "down") {
        ghost.y += GHOST_SPEED;
    }
    if (ghost.direction === "left") {
        ghost.x -= GHOST_SPEED;
    }
    if (ghost.direction === "right") {
        ghost.x += GHOST_SPEED;
    }
}

// Check if touching a ghost
function checkCollisionWithGhost(ghost) {
    if (gamePiece.x < ghost.x + ghost.width && gamePiece.x + gamePiece.width > ghost.x && gamePiece.y < ghost.y + ghost.height && gamePiece.y + gamePiece.height > ghost.y) {
        gameOverMessage()
        clearInterval(gameArea.interval);
    }
}

function characterMovement() {
    // Only one direction can be alive at a time
    if (gameArea.key === "ArrowUp") {
        gamePiece.direction = "up";
    } else if (gameArea.key === "ArrowDown") {
        gamePiece.direction = "down";
    } else if (gameArea.key === "ArrowLeft") {
        gamePiece.direction = "left";
    } else if (gameArea.key === "ArrowRight") {
        gamePiece.direction = "right";
    }
}

function checkWin(fruits) {
    if (fruits.length === 0) {
        gameOverMessage()
        clearInterval(gameArea.interval);

    }
}

function gameOverMessage() {
    gameArea.context.font = "30px Arial";
    gameArea.context.fillStyle = "red";
    gameArea.context.fillText("Game Over!", gameArea.canvas.width / 2 - 100, gameArea.canvas.height / 2);
}

function updateGameArea() {
    gameArea.clear();
    characterMovement();
    wallOne.update();
    wallTwo.update();
    wallThree.update();
    wallFour.update();
    wallFive.update();
    BorderSide.update();
    BorderSide2.update();
    BorderSide3.update();
    BorderSide4.update();
    gamePiece.newPosition();
    gamePiece.update();
    checkFruitCollision()
    for (var fruit of fruits) {
        fruit.update();
    }
    for (var ghost of ghosts) {
        moveGhost(ghost);
        ghost.update();
        checkCollisionWithGhost(ghost);
    }
    checkWin(fruits);
}

startGame();