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
var resetKey = "r";

//color Game
var colorRed = 'rgba(255, 0, 0, 1)';
var colorGreen = 'rgba(0, 255, 0, 1)';
var colorGrey = 'rgba(43, 43, 43, 0.3)';
var colorYellow = 'rgba(255, 255, 0, 1)';
var colorOrange = 'rgba(255, 69, 0, 1)';
var colorBlue = 'rgba(0, 0, 255, 1)';
var colorBlack = 'rgba(0, 0, 0, 1)'
var colorWhite = 'rgba(255, 255, 255, 1)'

//game
var note;
var noteTab = [];
var begin = false;
var randomSpawn;
var tileSize = 40;
var indice = 0;
var rythmeTable = [1, 1, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 4, 1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 4, 8, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 2, 4, 4, 2, 4, 4, 2, 8, 8, 8, 8, 8, 8, 8, 8, 2, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1, 1];

//timer
var timer;
var startTime = 0;
var ifFirstLoop = true;
var firstLoop = 1875.5;
var timerLoop = 2307.7;
var pause = false;

var menu = true;

//hud
var scoreHud;

//control
var rightPressed = false;
var rightMidPressed = false;
var leftMidPressed = false;
var leftPressed = false;

var changeKey = false;
var keySelected;

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

    rightButton = new component(640, 630, colorGreen, 100, 40, "k");
    rightMidButton = new component(540, 630, colorGreen, 100, 40, "j");
    leftMidButton = new component(440, 630, colorGreen, 100, 40, "f");
    leftButton = new component(340, 630, colorGreen, 100, 40, "d");

    scoreHud = new hud(0, 10, 0, 0, 0, 0, 0, 0);

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

    if (scoreHud.life <= 0) {
        resetGame();
        pauseGame();
        pause = false;
        begin = false;
    }
}

function draw(){
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (playingVideo) {
        context.drawImage(video, 0, 0, 1080, 720);
    } else {
        context.drawImage(image, 0, 0, 1080, 720);
    }
    if (!pause && menu) {
        context.drawImage(image, 0, 0, 1080, 720);
    }

    if (menu) {
        drawMenu();
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
    context.fillText("BAD: " + scoreHud.bad, 10, 270);
}

function drawMenu() {

    context.fillStyle = colorBlack;
    context.fillRect(800, 100, 280, 520);

    context.fillStyle = colorWhite;
    context.fillRect(800, 100, 280, 5);
    context.fillRect(800, 620, 280, 5);
    context.fillRect(800, 100, 5, 520);

    context.font = '20px Arial';
    context.fillStyle = colorWhite;
    context.fillText("PLAY / PAUSE: Space", 850, 150);
    context.fillText("RESET: " + resetKey, 850, 180);
    context.fillText("First press to select key", 850, 330);
    context.fillText("Second press to change", 850, 360);
    context.fillText("Press Space to cancel", 850, 390);
    context.fillText("PRINT Leaderboard: z", 850, 480);

    if (playingVideo) {
        context.fillText("DISABLE Video: a", 850, 450);
    }
    else {
        context.fillText("ENABLE Video: a", 850, 450);
    }

    context.fillStyle = leftButton.color;
    context.fillText("KEY 1: " + leftButton.key, 850, 210);
    context.fillStyle = leftMidButton.color;
    context.fillText("KEY 2: " + leftMidButton.key, 850, 240);
    context.fillStyle = rightMidButton.color;
    context.fillText("KEY 3: " + rightMidButton.key, 850, 270);
    context.fillStyle = rightButton.color;
    context.fillText("KEY 4: " + rightButton.key, 850, 300);
}

function keyDownHandler(e) {
    if (changeKey) {
        if (e.key != "r" && e.key != " " && e.key != "a" && e.key != "z") {
            if (keySelected == "right") {
                rightButton.key = e.key;
                rightButton.color = colorGreen;
            }
            else if (keySelected == "rightMid") {
                rightMidButton.key = e.key;
                rightMidButton.color = colorGreen;
            }
            else if (keySelected == "leftMid") {
                leftMidButton.key = e.key;
                leftMidButton.color = colorGreen;
            }
            else if (keySelected == "left") {
                leftButton.key = e.key;
                leftButton.color = colorGreen;
            }
            changeKey = false;
        }
        if (e.key == " ") {
            changeKey = false;
            rightButton.color = colorGreen;
            rightMidButton.color = colorGreen;
            leftMidButton.color = colorGreen;
            leftButton.color = colorGreen;
        }
    }
    else {
        if(e.key == rightButton.key) {
            if (rightPressed == false) {
                if (menu) {
                    changeKey = true;
                    keySelected = "right";
                    rightButton.color = colorRed;
                }
                else {
                    collision(rightButton);
                }
            }
            rightPressed = true;
        }
        else if(e.key == rightMidButton.key) {
            if (rightMidPressed == false) {
                if (menu) {
                    changeKey = true;
                    keySelected = "rightMid";
                    rightMidButton.color = colorRed;
                }
                else {
                    collision(rightMidButton);
                }
            }
            rightMidPressed = true;
        }
        else if(e.key == leftMidButton.key) {
            if (leftMidPressed == false) {
                if (menu) {
                    changeKey = true;
                    keySelected = "leftMid";
                    leftMidButton.color = colorRed;
                }
                else {
                    collision(leftMidButton);
                }
            }
            leftMidPressed = true;
        }
        else if(e.key == leftButton.key) {
            if (leftPressed == false) {
                if (menu) {
                    changeKey = true;
                    keySelected = "left";
                    leftButton.color = colorRed;
                }
                else {
                    collision(leftButton);
                }
            }
            leftPressed = true;
        }
        else if(e.key == " ") {
            if (pause) {
                playGame();
            }
            else if (!pause && menu) {
                resetGame();
            }
            else {
                pauseGame();
            }
        }
        else if(e.key == resetKey) {
            resetGame();
        }
        else if(e.key == "a") {
            if (playingVideo) {
                playingVideo = false;
            }
            else {
                playingVideo = true;
            }
        }
    }
    document.removeEventListener("keydown", keyDownHandler, false);
}

function keyUpHandler(e) {
    if(e.key == rightButton.key) {
        rightPressed = false;
        if (!menu) {
            rightButton.color = colorWhite;
        }
    }
    else if(e.key == rightMidButton.key) {
        rightMidPressed = false;
        if (!menu) {
            rightMidButton.color = colorWhite;
        }
    }
    else if(e.key == leftMidButton.key) {
        leftMidPressed = false;
        if (!menu) {
            leftMidButton.color = colorWhite;
        }
    }
    else if(e.key == leftButton.key) {
        leftPressed = false;
        if (!menu) {
            leftButton.color = colorWhite;
        }
    }
    document.removeEventListener("keyup", keyUpHandler, false);
}

function collision(button) {
    
    if (noteTab[0] != null) {
        if ((button.x + 30) == noteTab[0].x) {
            if (noteTab[0].y >= 610 && noteTab[0].y <= 650) {
                scoreHud.combo += 1;
                if (scoreHud.combo > scoreHud.comboMax) {
                    scoreHud.comboMax = scoreHud.combo;
                }
                scoreHud.score += (300*scoreHud.combo);
                scoreHud.perfect += 1;
                noteTab.splice(0, 1);
                button.color = colorGreen;
            }
            else if (noteTab[0].y >= 590 && noteTab[0].y <= 670) {
                scoreHud.combo += 1;
                if (scoreHud.combo > scoreHud.comboMax) {
                    scoreHud.comboMax = scoreHud.combo;
                }
                scoreHud.score += (100*scoreHud.combo);
                scoreHud.medium += 1;
                noteTab.splice(0, 1);
                button.color = colorYellow;
            }
            else if (noteTab[0].y >= 570 && noteTab[0].y <= 690) {
                scoreHud.combo += 1;
                if (scoreHud.combo > scoreHud.comboMax) {
                    scoreHud.comboMax = scoreHud.combo;
                }
                scoreHud.score += (50*scoreHud.combo);
                scoreHud.bad += 1;
                noteTab.splice(0, 1);
                button.color = colorOrange;
            }
            else if (noteTab[0].y < 570) {
                scoreHud.fail += 1;
                scoreHud.life -= 1;
                scoreHud.combo = 0;
                button.color = colorRed;
            }
            else if (noteTab[0].y > 690) {
                scoreHud.fail += 1;
                scoreHud.life -= 1;
                scoreHud.combo = 0;
                button.color = colorRed;
                noteTab.splice(0, 1);
            }
        }
        else {
            scoreHud.life -= 1;
            scoreHud.fail +=1;
            scoreHud.combo = 0;
            button.color = colorRed;
        }
        if ((scoreHud.combo%5 == 0) && scoreHud.combo != 0) {
            scoreHud.life += 1;
            if (scoreHud.life > 10) {
                scoreHud.life = 10;
            }
        }
    }
}

function spawnNote() {
    if (indice <= rythmeTable.length) {
        randomSpawn = Math.floor(Math.random() * 4);
        note = new component(370 + (randomSpawn*100), -tileSize, colorBlue, tileSize, tileSize, null);
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

function playGame() {
    video.play();
    menu = false;
    pause = false;
    begin = true;
    rightButton.color = colorWhite;
    rightMidButton.color = colorWhite;
    leftMidButton.color = colorWhite;
    leftButton.color = colorWhite;
}

function pauseGame() {
    video.pause();
    menu = true;
    pause = true;
    if (ifFirstLoop) {
        firstLoop = (firstLoop*(1/rythmeTable[indice-1])) - ((new Date()).getTime() - startTime);
    }
    else {
        firstLoop = (timerLoop*(1/rythmeTable[indice-1])) - ((new Date()).getTime() - startTime);
    }
    clearTimeout(timer);
    rightButton.color = colorGreen;
    rightMidButton.color = colorGreen;
    leftMidButton.color = colorGreen;
    leftButton.color = colorGreen;
}

function resetGame() {
    playGame();
    indice = 0;
    firstLoop = 1875.5;
    noteTab = [];
    video.currentTime = 0;
    clearTimeout(timer);
    scoreHud = new hud(0, 10, 0, 0, 0, 0, 0, 0);
}

function component(x, y, color, width, height, key) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.key = key;
}

function hud(score, life, combo, comboMax, fail, perfect, medium, bad) {
    this.score = score;
    this.life = life;
    this.combo = combo;
    this.comboMax = comboMax;
    this.fail = fail;
    this.perfect = perfect;
    this.medium = medium;
    this.bad = bad;
}