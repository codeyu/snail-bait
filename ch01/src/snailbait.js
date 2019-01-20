var canvas = document.getElementById('snailbait-game-canvas');
var context = canvas.getContext('2d');
var background = new Image();
var runnerImage = new Image();

function initializeImages() {
    background.src = 'images/background.png';
    runnerImage.src = 'images/runner.png';
    background.onload = function (e) {
        startGame();
    }
}

function startGame() {
    draw();
}

function draw() {
    drawBackground();
    drawRunner();
}

function drawBackground() {
    //以左上角为参考点，第一个参数为图像，第二个参数为X轴坐标，第三个参数为Y轴坐标
    context.drawImage(background, 0, 0);
}

function drawRunner() {
    context.drawImage(runnerImage, 50, 280);
}

//Launch game
initializeImages();