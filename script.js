const canvas = document.querySelector(".canvas");
const ball = document.createElement("div");
const paddle = document.createElement("div");

const paddleStart = [2, 41];
let paddleCurrentPosition = paddleStart;

const ballStartPosition = [2, 35];
let ballCurrentPosition = ballStartPosition;
let dx = 1;
let dy = -1;

let timer;

const paddleWidth = 18;
const paddleHeight = 1;
const canvasWidth = 66;
const canvasHeight = 44;
const ballDiameter = 5;
var paddleX;

class Block {
  width = 12;
  height = 3;
  constructor(left, top) {
    this.topLeft = [left, top];
    this.topRight = [left + this.width, top];
    this.bottomLeft = [left, top + this.height];
    this.bottomRight = [left + this.width, top + this.height];
  }
}

//start with 1 and add 13 to left
//start with 1 and add 4 to top
const allBlocks = [
  new Block(1, 1),
  new Block(14, 1),
  new Block(27, 1),
  new Block(40, 1),
  new Block(53, 1),
  new Block(1, 5),
  new Block(14, 5),
  new Block(27, 5),
  new Block(40, 5),
  new Block(53, 5),
  new Block(1, 9),
  new Block(14, 9),
  new Block(27, 9),
  new Block(40, 9),
  new Block(53, 9),
  new Block(1, 13),
  new Block(14, 13),
  new Block(27, 13),
  new Block(40, 13),
  new Block(53, 13),
];

function createBlocks() {
  for (let i = 0; i < allBlocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = allBlocks[i].topLeft[0] + "rem";
    block.style.top = allBlocks[i].topLeft[1] + "rem";
    canvas.appendChild(block);
  }
}

function createPaddle() {
  paddle.classList.add("paddle");
  paddle.style.left = paddleCurrentPosition[0] + "rem";
  paddle.style.top = paddleCurrentPosition[1] + "rem";
  canvas.appendChild(paddle);
}

function movePaddle() {
  paddle.onmousedown = function (event) {
    let shiftX = event.clientX - paddle.getBoundingClientRect().left;

    moveAt(event.pageX);

    function moveAt(pageX) {
      paddle.style.left = pageX - shiftX + "px";
      paddleX =  (pageX - shiftX) / 16;
    }

    function onMouseMove(event) {
      moveAt(event.pageX);
    }

    document.addEventListener("mousemove", onMouseMove);

    paddle.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      paddle.onmouseup = null;
    };
  };

  paddle.ondragstart = function () {
    return false;
  };
}


function createBall() {
  ball.classList.add("ball");
  drawBall();
  canvas.appendChild(ball);
}

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "rem";
  ball.style.top = ballCurrentPosition[1] + "rem";
}

function moveBall() {
  ballCurrentPosition[0] += dx;
  ballCurrentPosition[1] += dy;
  drawBall();
  checkForCollision();
}

function checkForCollision() {
  // check for paddle collision 
  if (
    ballCurrentPosition[0] + ballDiameter > paddleX &&
    ballCurrentPosition[0] < paddleX + paddleWidth &&
    ballCurrentPosition[1] + ballDiameter + paddleHeight > paddleCurrentPosition[1]
  ) {
    changeDirection();
  }

  // check for block collisions
  for (let i = 0; i < allBlocks.length; i++) {
    if (
      ballCurrentPosition[0] + ballDiameter > allBlocks[i].topLeft[0] &&
      ballCurrentPosition[0] < allBlocks[i].topRight[0] &&
      ballCurrentPosition[1] + ballDiameter > allBlocks[i].topLeft[1] &&
      ballCurrentPosition[1] < allBlocks[i].bottomLeft[1]
    ) {
      const blocks = Array.from(document.querySelectorAll(".block"));
      console.log(blocks);
      blocks[i].classList.remove("block");
      allBlocks.splice(i, 1);
      dy=-dy;
      changeDirection();
    }
  }

  // check wall collisions
  if (
    ballCurrentPosition[0] >= canvasWidth - ballDiameter ||
    ballCurrentPosition[1] <= 0 ||
    ballCurrentPosition[0] <= 0 
  ) {
    changeDirection();
  }
  // check for game over
  if (ballCurrentPosition[1] >= canvasHeight - ballDiameter) {
    clearInterval(timer);
    console.log("You lose!");
  }
}

function changeDirection() {
  if (
    ballCurrentPosition[1] + dy >= canvasHeight - ballDiameter ||
    ballCurrentPosition[1] + dy <= 0
  ) {
    dy = -dy;
  }
  if (
    ballCurrentPosition[0] + dx >= canvasWidth - ballDiameter ||
    ballCurrentPosition[0] + dx <= 0
  ) {
    dx = -dx;
  }
  ballCurrentPosition[0] += dx;
  ballCurrentPosition[1] += dy;
}

let startScreen = document.querySelector(".startForm");

let title = document.querySelector(".title");
let titleFont = document.createElement("h1");
let titleBackground = document.createElement("span");
title.appendChild(titleFont);
titleFont.appendChild(titleBackground);

function createGreeting(name) {
  return "Welcome to " + name;
}

//callback function usage
function displayGreeting(greetingFunction, userName) {
  return greetingFunction(userName);
}

var greeting = displayGreeting(createGreeting, "Breakout");

titleBackground.innerHTML += greeting;

let startButton = document.querySelector(".startBtn");
startButton.addEventListener("click", function () {
  startScreen.classList.add("active");
  createBlocks();
  createPaddle();
  movePaddle();
  createBall();
  timer = setInterval(moveBall, 100);
});

// document.addEventListener("DOMContentLoaded", function () {
//   createBlocks();
//   createPaddle();
//   movePaddle();
//   createBall();
//   timer = setInterval(moveBall, 100);
// });
