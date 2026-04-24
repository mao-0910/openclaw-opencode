const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

let snake = [];
let food = { x: 10, y: 10 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;

highScoreEl.textContent = highScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    direction = { x: 0, y: -1 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    scoreEl.textContent = score;
    spawnFood();
}

function spawnFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * TILE_COUNT);
        food.y = Math.floor(Math.random() * TILE_COUNT);
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function update() {
    if (!gameRunning || gamePaused) return;

    direction = { ...nextDirection };

    if (direction.x === 0 && direction.y === 0) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        ctx.fillStyle = i === 0 ? '#00ff88' : '#00cc6a';
        ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    }

    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreEl.textContent = highScore;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 40px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#fff';
    ctx.font = '24px Segoe UI';
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 30);

    restartBtn.style.display = 'inline-block';
}

function startGame() {
    initGame();
    gameRunning = true;
    gamePaused = false;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    draw();
    gameLoop = setInterval(update, 100);
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('暂停', canvas.width / 2, canvas.height / 2);
    } else {
        draw();
    }
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === ' ') {
        togglePause();
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

draw();