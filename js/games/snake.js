/* ==========================================
   SNAKE GAME
   ========================================== */

const SnakeGame = {
  create(container, onScore) {
    const CELL = 20;
    const COLS = 20;
    const ROWS = 20;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-wrapper';

    const canvas = document.createElement('canvas');
    canvas.id = 'snakeCanvas';
    canvas.width = W;
    canvas.height = H;
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    const ctx = canvas.getContext('2d');
    let snake, dir, nextDir, food, score, speed, gameLoop, running, gameOver;

    function init() {
      snake = [{ x: 10, y: 10 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = 120;
      running = false;
      gameOver = false;
      placeFood();
      draw();
      onScore('Skor: 0');
      showOverlay('🐍 Snake', 'Başlamak için Space / Tıkla', 'Başla');
    }

    function showOverlay(title, msg, btnText) {
      removeOverlay();
      const ov = document.createElement('div');
      ov.className = 'game-overlay';
      ov.id = 'snakeOverlay';
      ov.innerHTML = `<h2>${title}</h2><p>${msg}</p><button class="overlay-btn">${btnText}</button>`;
      ov.querySelector('button').addEventListener('click', () => {
        removeOverlay();
        start();
      });
      wrapper.appendChild(ov);
    }

    function removeOverlay() {
      const ov = document.getElementById('snakeOverlay');
      if (ov) ov.remove();
    }

    function start() {
      if (gameOver) init();
      running = true;
      gameLoop = setInterval(update, speed);
    }

    function placeFood() {
      let pos;
      do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some(s => s.x === pos.x && s.y === pos.y));
      food = pos;
    }

    function update() {
      dir = { ...nextDir };
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // wall wrap
      if (head.x < 0) head.x = COLS - 1;
      if (head.x >= COLS) head.x = 0;
      if (head.y < 0) head.y = ROWS - 1;
      if (head.y >= ROWS) head.y = 0;

      // self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        onScore('Skor: ' + score);
        placeFood();
        // speed up
        if (speed > 60) {
          clearInterval(gameLoop);
          speed -= 3;
          gameLoop = setInterval(update, speed);
        }
      } else {
        snake.pop();
      }

      draw();
    }

    function endGame() {
      clearInterval(gameLoop);
      running = false;
      gameOver = true;
      showOverlay('Oyun Bitti!', `Skor: ${score}`, 'Tekrar Oyna');
    }

    function draw() {
      // background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, W, H);

      // grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
      }
      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
      }

      // food
      ctx.fillStyle = '#ff2d95';
      ctx.shadowColor = '#ff2d95';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // snake
      snake.forEach((seg, i) => {
        const alpha = 1 - (i / snake.length) * 0.5;
        ctx.fillStyle = i === 0
          ? `rgba(0, 240, 255, ${alpha})`
          : `rgba(0, 200, 220, ${alpha})`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = i === 0 ? 10 : 4;
        const margin = i === 0 ? 1 : 2;
        ctx.fillRect(seg.x * CELL + margin, seg.y * CELL + margin, CELL - margin * 2, CELL - margin * 2);
      });
      ctx.shadowBlur = 0;
    }

    const keyHandler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ') {
        if (!running) {
          removeOverlay();
          start();
        }
        return;
      }
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 }
      };
      const nd = map[e.key];
      if (nd && (nd.x + dir.x !== 0 || nd.y + dir.y !== 0)) {
        nextDir = nd;
      }
    };

    document.addEventListener('keydown', keyHandler);

    // Touch support
    let touchStart = null;
    const touchStartHandler = (e) => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const touchEndHandler = (e) => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        if (!running) { removeOverlay(); start(); }
        return;
      }
      let nd;
      if (Math.abs(dx) > Math.abs(dy)) {
        nd = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        nd = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }
      if (nd.x + dir.x !== 0 || nd.y + dir.y !== 0) nextDir = nd;
    };
    canvas.addEventListener('touchstart', touchStartHandler, { passive: true });
    canvas.addEventListener('touchend', touchEndHandler);

    init();

    return {
      destroy() {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', keyHandler);
        canvas.removeEventListener('touchstart', touchStartHandler);
        canvas.removeEventListener('touchend', touchEndHandler);
      }
    };
  }
};
