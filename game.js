(function() {
    'use strict';

    // === Constants ===
    const GRID_SIZE = 20;
    const CANVAS_SIZE = 400;
    const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
    const SCORE_PER_FOOD = 10;
    const INITIAL_SNAKE_LENGTH = 3;
    const INITIAL_POSITION = 10;
    const STORAGE_KEY = 'snakeHighScore';
    const SKIN_STORAGE_KEY = 'snakeUsedSkins';

    // === Skin Colors ===
    const skinColors = {
        classic: { start: [0, 255, 136], end: [0, 155, 68] },
        rainbow: { start: [255, 0, 0], end: [0, 0, 255] },
        neonPurple: { start: [200, 0, 255], end: [100, 0, 200] }
    };

    // === Game Class ===
    class Game {
        constructor() {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.scoreEl = document.getElementById('score');
            this.highScoreEl = document.getElementById('highScore');
            this.startBtn = document.getElementById('startBtn');
            this.restartBtn = document.getElementById('restartBtn');

            this.snake = [];
            this.food = { x: INITIAL_POSITION, y: INITIAL_POSITION };
            this.obstacles = [];
            this.direction = { x: 0, y: 0 };
            this.nextDirection = { x: 0, y: 0 };
            this.score = 0;
            this.highScore = this.loadHighScore();
            this.gameRunning = false;
            this.gamePaused = false;
            this.currentMode = 'classic';
            this.currentSkin = 'classic';

            this.particles = [];
            this.mouseX = CANVAS_SIZE / 2;
            this.mouseY = CANVAS_SIZE / 2;
            this.foodPulse = 0;
            this.scoreBump = 0;
            this.gameOverFlash = 0;
            this.animationId = null;
            this.lastTime = 0;
            this.accumulator = 0;
            this.gameSpeed = 100;

            this.highScoreEl.textContent = this.highScore;
            this.initParticles();
            this.bindEvents();
        }

        loadHighScore() {
            try {
                return parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
            } catch (e) {
                return 0;
            }
        }

        saveHighScore() {
            try {
                localStorage.setItem(STORAGE_KEY, this.highScore);
            } catch (e) {
                console.warn('无法保存最高分:', e);
            }
        }

        recordUsedSkin() {
            try {
                const usedSkins = JSON.parse(localStorage.getItem(SKIN_STORAGE_KEY)) || [];
                if (!usedSkins.includes(this.currentSkin)) {
                    usedSkins.push(this.currentSkin);
                    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(usedSkins));
                }
            } catch (e) {}
        }

        initParticles() {
            this.particles = [];
            for (let i = 0; i < 80; i++) {
                this.particles.push({
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

        updateParticles() {
            this.particles.forEach(p => {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 10000) {
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

        drawParticles() {
            this.particles.forEach(p => {
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }

        generateObstacles() {
            this.obstacles = [];
            const count = this.currentMode === 'easy' ? 5 : this.currentMode === 'challenge' ? 10 : 0;
            for (let i = 0; i < count; i++) {
                let validPosition = false;
                let attempts = 0;
                while (!validPosition && attempts < 100) {
                    const x = Math.floor(Math.random() * TILE_COUNT);
                    const y = Math.floor(Math.random() * TILE_COUNT);
                    const isSnake = this.snake.some(seg => seg.x === x && seg.y === y);
                    const isFood = this.food.x === x && this.food.y === y;
                    const isObstacle = this.obstacles.some(o => o.x === x && o.y === y);
                    const isNearStart = x < 5 && y < 5;
                    if (!isSnake && !isFood && !isObstacle && !isNearStart) {
                        this.obstacles.push({ x, y });
                        validPosition = true;
                    }
                    attempts++;
                }
            }
        }

        drawObstacles() {
            this.obstacles.forEach(obs => {
                this.ctx.save();
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#ff4444';
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(obs.x * GRID_SIZE + 2, obs.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
                this.ctx.strokeStyle = '#ff4444';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obs.x * GRID_SIZE + 2, obs.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
                this.ctx.restore();
            });
        }

        initGame() {
            this.snake = [];
            for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
                this.snake.push({ x: INITIAL_POSITION, y: INITIAL_POSITION + i });
            }
            this.direction = { x: 0, y: -1 };
            this.nextDirection = { x: 0, y: -1 };
            this.score = 0;
            this.scoreEl.textContent = this.score;
            this.scoreBump = 0;
            this.generateObstacles();
            this.spawnFood();
        }

        spawnFood() {
            let validPosition = false;
            while (!validPosition) {
                this.food.x = Math.floor(Math.random() * TILE_COUNT);
                this.food.y = Math.floor(Math.random() * TILE_COUNT);
                validPosition = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y) &&
                                !this.obstacles.some(o => o.x === this.food.x && o.y === this.food.y);
            }
        }

        update() {
            if (!this.gameRunning || this.gamePaused) return;

            this.direction = { ...this.nextDirection };

            if (this.direction.x === 0 && this.direction.y === 0) return;

            const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

            if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
                this.gameOver();
                return;
            }

            if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                this.gameOver();
                return;
            }

            if (this.obstacles.some(o => o.x === head.x && o.y === head.y)) {
                this.gameOver();
                return;
            }

            this.snake.unshift(head);

            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += SCORE_PER_FOOD;
                this.scoreEl.textContent = this.score;
                this.scoreBump = 1;
                this.spawnFood();
            } else {
                this.snake.pop();
            }
        }

        getSnakeGradientColor(index, total) {
            const colors = skinColors[this.currentSkin];
            const ratio = total > 1 ? index / (total - 1) : 0;

            const r = Math.floor(colors.start[0] + ratio * (colors.end[0] - colors.start[0]));
            const g = Math.floor(colors.start[1] + ratio * (colors.end[1] - colors.start[1]));
            const b = Math.floor(colors.start[2] + ratio * (colors.end[2] - colors.start[2]));

            return `rgb(${r}, ${g}, ${b})`;
        }

        draw() {
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.updateParticles();
            this.drawParticles();
            this.drawObstacles();

            for (let i = 0; i < this.snake.length; i++) {
                const segment = this.snake[i];
                const isHead = i === 0;
                const color = this.getSnakeGradientColor(i, this.snake.length);

                this.ctx.save();
                this.ctx.shadowBlur = isHead ? 20 : 15 - i * 0.5;
                this.ctx.shadowColor = color;
                this.ctx.fillStyle = color;
                this.ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
                this.ctx.restore();
            }

            this.foodPulse += 0.1;
            const pulseSize = 4 + Math.sin(this.foodPulse) * 2;
            const gradient = this.ctx.createRadialGradient(
                this.food.x * GRID_SIZE + GRID_SIZE / 2, this.food.y * GRID_SIZE + GRID_SIZE / 2, 0,
                this.food.x * GRID_SIZE + GRID_SIZE / 2, this.food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE
            );
            gradient.addColorStop(0, '#ff6666');
            gradient.addColorStop(1, '#ff4444');
            this.ctx.save();
            this.ctx.shadowBlur = 15 + Math.sin(this.foodPulse) * 5;
            this.ctx.shadowColor = '#ff4444';
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * GRID_SIZE + GRID_SIZE / 2,
                this.food.y * GRID_SIZE + GRID_SIZE / 2,
                pulseSize,
                0, Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();

            if (this.scoreBump > 0) {
                this.scoreBump -= 0.05;
                this.scoreEl.style.transform = `scale(${1 + this.scoreBump * 0.3})`;
                this.scoreEl.style.textShadow = `0 0 ${this.scoreBump * 20}px #00ff88`;
            } else {
                this.scoreEl.style.transform = 'scale(1)';
                this.scoreEl.style.textShadow = 'none';
            }

            if (this.gameOverFlash > 0) {
                this.ctx.save();
                this.ctx.fillStyle = `rgba(255, 255, 255, ${this.gameOverFlash})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
                this.gameOverFlash -= 0.03;
            }
        }

        gameLoop(currentTime) {
            if (!this.gameRunning) return;

            if (currentTime === undefined) {
                currentTime = 0;
            }

            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            this.accumulator += deltaTime;

            while (this.accumulator >= this.gameSpeed) {
                this.update();
                this.accumulator -= this.gameSpeed;
            }

            this.draw();
            this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
        }

        gameOver() {
            this.gameRunning = false;
            this.gameOverFlash = 1;
            this.recordUsedSkin();

            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }

            setTimeout(() => {
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.saveHighScore();
                    this.highScoreEl.textContent = this.highScore;
                }

                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.save();
                this.ctx.shadowBlur = 30;
                this.ctx.shadowColor = '#ff4444';
                this.ctx.fillStyle = '#ff4444';
                this.ctx.font = 'bold 40px Segoe UI';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 20);
                this.ctx.restore();

                this.ctx.fillStyle = '#fff';
                this.ctx.font = '24px Segoe UI';
                this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 30);

                this.restartBtn.style.display = 'inline-block';
                this.restartBtn.classList.remove('hidden');
                document.getElementById('gameOverModal').style.display = 'flex';
                document.getElementById('finalScore').textContent = this.score;
            }, 300);
        }

        start() {
            this.initGame();
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.style.display = 'none';
            this.restartBtn.style.display = 'none';
            this.lastTime = 0;
            this.accumulator = 0;
            this.gameLoop();
        }

        togglePause() {
            if (!this.gameRunning) return;
            this.gamePaused = !this.gamePaused;
            if (this.gamePaused) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 30px Segoe UI';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('暂停', this.canvas.width / 2, this.canvas.height / 2);
            } else {
                this.lastTime = performance.now();
                this.draw();
            }
        }

        setDirection(dir) {
            switch (dir) {
                case 'up':
                    if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
                    break;
                case 'down':
                    if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
                    break;
                case 'left':
                    if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
                    break;
                case 'right':
                    if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
                    break;
            }
        }

        selectMode(mode) {
            this.currentMode = mode;
            this.start();
        }

        selectSkin(skin) {
            this.currentSkin = skin;
            document.querySelectorAll('.skin-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.skin === skin);
            });
        }

        bindEvents() {
            document.addEventListener('keydown', (e) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault();
                }

                if (e.key === ' ') {
                    this.togglePause();
                    return;
                }

                switch (e.key) {
                    case 'ArrowUp': this.setDirection('up'); break;
                    case 'ArrowDown': this.setDirection('down'); break;
                    case 'ArrowLeft': this.setDirection('left'); break;
                    case 'ArrowRight': this.setDirection('right'); break;
                }
            });

            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });

            let touchStartX = 0;
            let touchStartY = 0;

            this.canvas.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                e.preventDefault();
            }, { passive: false });

            this.canvas.addEventListener('touchend', (e) => {
                if (!this.gameRunning) return;
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;
                const minSwipe = 30;

                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > minSwipe) this.setDirection('right');
                    else if (dx < -minSwipe) this.setDirection('left');
                } else {
                    if (dy > minSwipe) this.setDirection('down');
                    else if (dy < -minSwipe) this.setDirection('up');
                }
            }, { passive: false });

            document.querySelectorAll('.touch-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!this.gameRunning) return;
                    this.setDirection(btn.dataset.dir);
                });
            });

            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.selectMode(btn.dataset.mode);
                });
            });

            document.querySelectorAll('.skin-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.selectSkin(btn.dataset.skin);
                });
            });

            this.startBtn.addEventListener('click', () => this.start());
            this.restartBtn.addEventListener('click', () => {
                document.getElementById('modeSelect').style.display = 'flex';
                this.restartBtn.style.display = 'none';
                this.startBtn.style.display = 'inline-block';
            });
            document.getElementById('modalRestartBtn').addEventListener('click', () => {
                document.getElementById('gameOverModal').style.display = 'none';
                document.getElementById('modeSelect').style.display = 'flex';
                this.restartBtn.style.display = 'none';
                this.startBtn.style.display = 'inline-block';
            });
        }

        render() {
            this.draw();
        }
    }

    // === Init ===
    const game = new Game();
    game.render();

})();
