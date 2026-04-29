const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const SCORE_PER_FOOD = 10;
const GAME_SPEED = 100;
const STORAGE_KEY = 'snakeHighScore';
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_POSITION = 10;

let snake = [];
let food = { x: INITIAL_POSITION, y: INITIAL_POSITION };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;

let particles = [];
let mouseX = CANVAS_SIZE / 2;
let mouseY = CANVAS_SIZE / 2;
let foodPulse = 0;
let scoreBump = 0;
let gameOverFlash = 0;
let animationId = null;

try {
    highScore = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
} catch (e) {
    highScore = 0;
}
highScoreEl.textContent = highScore;

function createParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * CANVAS_SIZE,
            y: Math.random() * CANVAS_SIZE,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: ['#00ff88', '#00ff99', '#00cc88', '#00ffcc', '#00aaff', '#0088ff'][Math.floor(Math.random() * 6)],
            alpha: Math.random() * 0.5 + 0.2
        });
    }
}

function updateParticles() {
    particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
        } else {
            p.x += p.speedX;
            p.y += p.speedY;
        }
        if (p.x < 0) p.x = CANVAS_SIZE;
        if (p.x > CANVAS_SIZE) p.x = 0;
        if (p.y < 0) p.y = CANVAS_SIZE;
        if (p.y > CANVAS_SIZE) p.y = 0;
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function initGame() {
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: INITIAL_POSITION, y: INITIAL_POSITION + i });
    }
    direction = { x: 0, y: -1 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    scoreEl.textContent = score;
    scoreBump = 0;
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
        score += SCORE_PER_FOOD;
        scoreEl.textContent = score;
        scoreBump = 1;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function getSnakeGradientColor(index, total) {
    const ratio = total > 1 ? index / (total - 1) : 0;
    const r = Math.floor(0 + ratio * 0);
    const g = Math.floor(255 - ratio * 100);
    const b = Math.floor(136 - ratio * 68);
    return `rgb(${r}, ${g}, ${b})`;
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateParticles();
    drawParticles();

    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const isHead = i === 0;
        const color = getSnakeGradientColor(i, snake.length);

        ctx.save();
        ctx.shadowBlur = isHead ? 20 : 15 - i * 0.5;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        ctx.restore();
    }

    foodPulse += 0.1;
    const pulseSize = 4 + Math.sin(foodPulse) * 2;
    const gradient = ctx.createRadialGradient(
        food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, 0,
        food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE
    );
    gradient.addColorStop(0, '#ff6666');
    gradient.addColorStop(1, '#ff4444');
    ctx.save();
    ctx.shadowBlur = 15 + Math.sin(foodPulse) * 5;
    ctx.shadowColor = '#ff4444';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        pulseSize,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    if (scoreBump > 0) {
        scoreBump -= 0.05;
        scoreEl.style.transform = `scale(${1 + scoreBump * 0.3})`;
        scoreEl.style.textShadow = `0 0 ${scoreBump * 20}px #00ff88`;
    } else {
        scoreEl.style.transform = 'scale(1)';
        scoreEl.style.textShadow = 'none';
    }

    if (gameOverFlash > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${gameOverFlash})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        gameOverFlash -= 0.03;
    }

    animationId = requestAnimationFrame(draw);
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameOverFlash = 1;

    setTimeout(() => {
        if (score > highScore) {
            highScore = score;
            try {
                localStorage.setItem(STORAGE_KEY, highScore);
            } catch (e) {
                console.warn('无法保存最高分:', e);
            }
            highScoreEl.textContent = highScore;
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff4444';
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 40px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 20);
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = '24px Segoe UI';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 30);

        restartBtn.style.display = 'inline-block';
    }, 300);
}

function startGame() {
    initGame();
    gameRunning = true;
    gamePaused = false;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    if (animationId) cancelAnimationFrame(animationId);
    draw();
    gameLoop = setInterval(update, GAME_SPEED);
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

function setDirection(dir) {
    switch (dir) {
        case 'up':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'down':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'left':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'right':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
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
            setDirection('up');
            break;
        case 'ArrowDown':
            setDirection('down');
            break;
        case 'ArrowLeft':
            setDirection('left');
            break;
        case 'ArrowRight':
            setDirection('right');
            break;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const minSwipe = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > minSwipe) setDirection('right');
        else if (dx < -minSwipe) setDirection('left');
    } else {
        if (dy > minSwipe) setDirection('down');
        else if (dy < -minSwipe) setDirection('up');
    }
}, { passive: false });

document.querySelectorAll('.touch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!gameRunning) return;
        setDirection(btn.dataset.dir);
    });
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
document.getElementById('modalRestartBtn').addEventListener('click', () => {
    document.getElementById('gameOverModal').style.display = 'none';
    startGame();
});

createParticles();
draw();