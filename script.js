var canvas;
var context;
var image;
var video;
var playingVideo = true;

// player Button
var rightButton;
var rightMidButton;
var leftMidButton;
var leftButton;
var widthButton = 100;
var heightButton = 75;

//color Game
var colorRed = 'rgba(255, 0, 0, 1)';
var colorGreen = 'rgba(0, 255, 0, 0.4)';
var colorGrey = 'rgba(43, 43, 43, 0.3)';
var colorOrange = 'rgba(255, 69, 0, 0.4)';
var colorBlue = 'rgba(0, 0, 255, 1)';
var colorBlack = 'rgba(0, 0, 0, 1)'

//game
var note;
var noteTab = [];
var begin = false;
var randomSpawn;
var tileSize = 40;
var indice = 0;
var rythmeTable = [1, 1, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 4, 1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 4, 8, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 2, 4, 4, 2, 4, 4, 2, 8, 8, 8, 8, 8, 8, 8, 8, 2, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1, 1];

var timer;
var startTime = 0;
var ifFirstLoop = true;
var firstLoop = 1850;
var timerLoop = 2308.3;
var pause = false;


//hud
var scoreHud;

//control
var rightPressed = false;
var rightMidPressed = false;
var leftMidPressed = false;
var leftPressed = false;
var spacePressed = false;

//fps
var secondsPassed;
var oldTimeStamp;
var fps;

window.onload = startGame;

function startGame() {
    video = document.getElementById("video");
    image = document.getElementById("image");
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    rightButton = new component(640, 630, colorRed, 100, 40);
    rightMidButton = new component(540, 630, colorRed, 100, 40);
    leftMidButton = new component(440, 630, colorRed, 100, 40);
    leftButton = new component(340, 630, colorRed, 100, 40);

    scoreHud = new hud(0, 10, 0, 0, 0, 0, 0);

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    frameController(timeStamp);
    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw(){
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (playingVideo) {
        context.drawImage(video, 0, 0, 1080, 720);
    } else {
        context.drawImage(image, 0, 0, 1080, 720);
    }

    //background
    context.fillStyle = colorGrey;
    context.fillRect(340, 0, 400, 720);

    //touches du jeu
    context.fillStyle = rightButton.color;
    context.fillRect(rightButton.x, rightButton.y, rightButton.width, rightButton.height);
    context.fillStyle = rightMidButton.color;
    context.fillRect(rightMidButton.x, rightMidButton.y, rightMidButton.width, rightMidButton.height);
    context.fillStyle = leftMidButton.color;
    context.fillRect(leftMidButton.x, leftMidButton.y, leftMidButton.width, leftMidButton.height);
    context.fillStyle = leftButton.color;
    context.fillRect(leftButton.x, leftButton.y, leftButton.width, leftButton.height);

    noteTab.forEach((item, index) => {
        context.fillStyle = colorBlue;
        context.fillRect(item.x, item.y, item.width, item.height);
    })

    //cordes et délimitations
    context.fillStyle = colorBlack;
    context.fillRect(338, 0, 4, 720);
    context.fillRect(438, 0, 4, 720);
    context.fillRect(538, 0, 4, 720);
    context.fillRect(638, 0, 4, 720);
    context.fillRect(738, 0, 4, 720);

    context.fillRect(340, 645, 30, 6);
    context.fillRect(410, 645, 60, 6);
    context.fillRect(510, 645, 60, 6);
    context.fillRect(610, 645, 60, 6);
    context.fillRect(710, 645, 30, 6);

    // HUD
    context.font = '25px Arial';
    context.fillStyle = colorRed;
    context.fillText("FPS: " + fps, 10, 30);
    context.fillText("SCORE: " + scoreHud.score, 10, 60);
    context.fillText("LIFE: " + scoreHud.life, 10, 90);
    context.fillText("FAIL: " + scoreHud.fail, 10, 120);
    context.fillText("COMBO: " + scoreHud.combo, 10, 150);
    context.fillText("COMBO MAX: " + scoreHud.comboMax, 10, 180);
    context.fillText("PERFECT: " + scoreHud.perfect, 10, 210);
    context.fillText("MEDIUM: " + scoreHud.medium, 10, 240);
}

function update() {
    if (begin) {
        startTime = (new Date()).getTime();
        timer = setTimeout(spawnNote, firstLoop);
        begin = false;
    }

    if (!pause) {
        noteTab.forEach((item, index) => {
            item.y += 10;
        })
        if (noteTab[0] != null) {
            if (noteTab[0].y > 720) {
                scoreHud.life -= 1;
                scoreHud.fail +=1;
                scoreHud.combo = 0;
                noteTab.splice(0, 1);
            }
        }
    }
}

function keyDownHandler(e) {
    if(e.key == "k" || e.key == "K") {
        if (rightPressed == false) {
            //rightButton.color = colorGreen;
            collision(rightButton);
        }
        rightPressed = true;
    }
    else if(e.key == "j" || e.key == "J") {
        if (rightMidPressed == false) {
            //rightMidButton.color = colorGreen;
            collision(rightMidButton);
        }
        rightMidPressed = true;
    }
    else if(e.key == "f" || e.key == "F") {
        if (leftMidPressed == false) {
            //leftMidButton.color = colorGreen;
            collision(leftMidButton);
        }
        leftMidPressed = true;
    }
    else if(e.key == "d" || e.key == "D") {
        if (leftPressed == false) {
            //leftButton.color = colorGreen;
            collision(leftButton);
        }
        leftPressed = true;
    }
    else if(e.key == " ") {
        if (spacePressed == false) {
            resetGame();
        }
        spacePressed = true;
    }
    else if(e.key == "a") {
        pauseGame();
    }
    else if(e.key == "z") {
        playGame();
    }
    document.removeEventListener("keydown", keyDownHandler, false);
}

function keyUpHandler(e) {
    if(e.key == "k" || e.key == "K") {
        rightPressed = false;
        rightButton.color = colorRed;
    }
    else if(e.key == "j" || e.key == "J") {
        rightMidPressed = false;
        rightMidButton.color = colorRed;
    }
    else if(e.key == "f" || e.key == "F") {
        leftMidPressed = false;
        leftMidButton.color = colorRed;
    }
    else if(e.key == "d" || e.key == "D") {
        leftPressed = false;
        leftButton.color = colorRed;
    }
    else if(e.key == " ") {
        spacePressed = false;
    }
    document.removeEventListener("keyup", keyUpHandler, false);
}

function collision(button) {
    
        if ((button.x + 30) == noteTab[0].x) {
            if (noteTab[0].y >= 600 && noteTab[0].y <= 650) {
                scoreHud.combo += 1;
                if (scoreHud.combo > scoreHud.comboMax) {
                    scoreHud.comboMax = scoreHud.combo;
                }
                scoreHud.score += (300*scoreHud.combo);
                scoreHud.perfect += 1;
                noteTab.splice(0, 1);
                button.color = colorGreen;
            }
            else if (noteTab[0].y >= 570 && noteTab[0].y <= 680) {
                scoreHud.combo += 1;
                if (scoreHud.combo > scoreHud.comboMax) {
                    scoreHud.comboMax = scoreHud.combo;
                }
                scoreHud.score += (100*scoreHud.combo);
                scoreHud.medium += 1;
                noteTab.splice(0, 1);
                button.color = colorOrange;
            }
            else if (noteTab[0].y < 650) {
                scoreHud.fail += 1;
                scoreHud.life -= 1;
                scoreHud.combo = 0;
            }
            else if (noteTab[0].y > 650) {
                scoreHud.fail += 1;
                scoreHud.life -= 1;
                scoreHud.combo = 0;
                noteTab.splice(0, 1);
            }
        }
        else {
            scoreHud.life -= 1;
            scoreHud.fail +=1;
            scoreHud.combo = 0;
        }
        if ((scoreHud.combo%5 == 0) && scoreHud.combo != 0) {
            scoreHud.life += 1;
            if (scoreHud.life > 10) {
                scoreHud.life = 10;
            }
        }
}

function spawnNote() {
    if (indice <= rythmeTable.length) {
        randomSpawn = Math.floor(Math.random() * 4);
        note = new component(370 + (randomSpawn*100), -tileSize, colorBlue, tileSize, tileSize);
        noteTab.push(note);
        if (video.currentTime == 0) {
            return;
        }
        indice += 1;
        startTime = (new Date()).getTime();
        ifFirstLoop = false;
        timer = setTimeout(spawnNote, timerLoop*(1/rythmeTable[indice-1]));
    }
}

function frameController(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);
}

function playVideo() {
    playingVideo = true;
}

function playImage() {
    playingVideo = false;
}

function playGame() {
    if (pause == true) {
        video.play();
        pause = false;
        begin = true;
    }
}

function pauseGame() {
    video.pause();
    pause = true;
    if (ifFirstLoop) {
        firstLoop = firstLoop - ((new Date()).getTime() - startTime);
    }
    else {
        firstLoop = timerLoop - ((new Date()).getTime() - startTime);
    }
    clearTimeout(timer);
}

function resetGame() {
    video.play();
    indice = 0;
    firstLoop = 1850;
    pause = false;
    begin = true;
    noteTab = [];
    video.currentTime = 0;
    clearTimeout(timer);
    scoreHud = new hud(0, 10, 0, 0, 0, 0, 0);
}

function component(x, y, color, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
}

function hud(score, life, combo, comboMax, fail, perfect, medium) {
    this.score = score;
    this.life = life;
    this.combo = combo;
    this.comboMax = comboMax;
    this.fail = fail;
    this.perfect = perfect;
    this.medium = medium;
}