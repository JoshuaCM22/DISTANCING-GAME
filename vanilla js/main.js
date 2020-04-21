// Created by: Joshua C. Magoliman
const audioInGame = new Audio('audio/in-game.mp3');
const audioGameOver = new Audio('audio/gameover.mp3');
let gameCanvasElements = "";
let startTime = 0;
let contextValue = "";
let fontStyleAndColor = "";
const mouseOffset = 2;
let currentLoopCountOffset = 0;
let imgRestart = "";
let restart = 0;
let imgMe = "";
let imgCloud = "";
let container = { id: "container", width: 1200, height: 500 };
let player = { id: "player", x: container.width / 2, y: container.height - 50, width: 50, height: 80, speedX: 20, speedY: 5 };
let cloud = { id: "cloud", x: -150, y: 50, width: 150, height: 100, speedX: 3, speedY: 5 };

const playAudio = (param_audio) => {
  param_audio.play();
}
const stopAudio = (param_audio) => {
  param_audio.pause();
  param_audio.currentTime = 0;
}
const initializing = () => {
  gameCanvasElements = document.getElementById("gameCanvas");
  gameCanvasElements.addEventListener('webkitfullscreenchange', function (e) {
    gameCanvasElements.setAttribute("width", 1200);
    gameCanvasElements.setAttribute("height", 500);
    container.width = 1200;
    container.height = 500;
    fontStyleAndColor.font = "25px arial";
  });
  fontStyleAndColor = { font: "25px arial", fontColor: "black" };
  contextValue = gameCanvasElements.getContext("2d");
  contextValue.font = fontStyleAndColor.font;
  contextValue.fillText("Mechanics: Avoid to collide in any circles as long as you can", container.width / 3 - 5 * 25,
    container.height / 5);
  contextValue.fillText("Control: Use your mouse or touchpad to move around", container.width / 3 - 3 * 25,
    container.height / 4);
  contextValue.fillText("Click Here To Start Game", container.width / 2 - 5 * 25,
    container.height / 2);
  document.getElementById("gameCanvas").addEventListener("mousemove", moveMouseAround);
}
function moveMouseAround() {
  if (currentLoopCountOffset == mouseOffset) {
    currentLoopCountOffset = 0;
    if (event.pageX - this.offsetLeft > player.width / 2 && event.pageX - this.offsetLeft <= container.width - player.width / 2) {
      player.x = event.pageX - player.width / 2 - this.offsetLeft;
    }
    if (event.pageY - this.offsetTop > player.height / 2 && event.pageY - this.offsetTop <= container.height - player.height / 2) {
      player.y = event.pageY - player.height / 2 - this.offsetTop;
    }
  }
  currentLoopCountOffset++;
}
const playAgain = () => {
  stopAudio(audioGameOver);
  playAudio(audioInGame);
  fontStyleAndColor = { font: "25px arial", fontColor: "black" };
  startTime = new Date();
  gameLoop = setInterval(moveBalls, 20);
  enemyIncrementLoop = setInterval(incrementEnemy, 5000);
  objects = [];
  incrementEnemy();
}
const incrementEnemy = () => {
  if (objects.length < 10) {
    r = Math.ceil(Math.random() * 255);
    g = Math.ceil(Math.random() * 255);
    b = Math.ceil(Math.random() * 255);
    color = "rgba(" + r + "," + g + "," + b + ",0.5)";
    xPosition = container.width * Math.random();
    xRadius = 50;
    xRadius = Math.ceil(Math.random() * 40) + 10;
    xSpeed = Math.ceil(Math.random() * 6) + 2;
    ySpeed = Math.ceil(Math.random() * 6) + 2;
    if (xPosition <= 2 * xRadius || xPosition + 2 * xRadius >= container.width) {
      xPosition = container.width / 2;
    }
    objects.push({ id: "#circle", radius: xRadius, speedX: xSpeed, speedY: ySpeed, color: color, centerX: xPosition, centerY: 80 });
  }
}
const moveBalls = () => {
  contextValue.clearRect(0, 0, container.width, container.height);
  for (i in objects) {
    object = objects[i];
    // Check if the collision is happen
    if ((object.centerY + object.radius * 0.75 >= player.y && object.centerY + object.radius * 0.75 <= player.y + player.height) || (object.centerY - object.radius * 0.75 >= player.y && object.centerY - object.radius * 0.75 <= player.y + player.height)) {
      if ((object.centerX + object.radius * 0.75 > player.x && object.centerX + object.radius * 0.75 < player.x + player.width) || (object.centerX - object.radius * 0.75 > player.x && object.centerX - object.radius * 0.75 < player.x + player.width)) {
        score = Math.ceil((new Date() - startTime) / 1000);
        fontStyleAndColor = { font: "25px arial", fontColor: "red" };
        contextValue.fillStyle = fontStyleAndColor.fontColor;
        stopAudio(audioInGame);
        playAudio(audioGameOver);
        contextValue.fillText("Game Over", container.width / 2 - 3 * 25, container.height / 2);
        contextValue.fillText("Score : " + score + " seconds", container.width / 2 - 4 * 25, container.height / 2 + 35);
        imgRestart = document.getElementById("restart");
        restart = { x: container.width * 0.5 - 50, y: container.height * 0.75 - 50, width: 100, height: 100 };
        contextValue.drawImage(imgRestart, restart.x, restart.y, restart.width, restart.height);
        clearInterval(gameLoop);
        clearInterval(enemyIncrementLoop);
      }
    }
    if (object.centerX + object.radius > container.width || object.centerX - object.radius < 0) {
      object.speedX *= -1;
    }
    if (object.centerY + object.radius > container.height || object.centerY - object.radius < 0) {
      object.speedY *= -1;
    }
    contextValue.beginPath();
    contextValue.fillStyle = object.color;
    contextValue.arc(object.centerX, object.centerY, object.radius, 0, 2 * Math.PI);
    contextValue.fill();
    object.centerX += object.speedX;
    object.centerY += object.speedY;
  } // End of for loop
  imgMe = document.getElementById("me");
  imgCloud = document.getElementById("cloud");
  contextValue.drawImage(imgMe, player.x, player.y, player.width, player.height);
  contextValue.drawImage(imgCloud, cloud.x, cloud.y, cloud.width, cloud.height);
  cloud.x = cloud.x + cloud.speedX;
  if (cloud.x > container.width) {
    cloud.x = (cloud.width * -1) - 20;
  }
  contextValue.font = fontStyleAndColor.font;
  contextValue.fillStyle = fontStyleAndColor.fontColor;
  contextValue.fillText("Milliseconds : " + (new Date() - startTime) + "", container.width * 0.8, 40);
}