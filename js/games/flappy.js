/* ==========================================
   FLAPPY BIRD GAME
   ========================================== */

const FlappyGame = {
  create(container, onScore) {
    const W = 400, H = 500;

    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-wrapper';

    const canvas = document.createElement('canvas');
    canvas.id = 'flappyCanvas';
    canvas.width = W;
    canvas.height = H;
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    const ctx = canvas.getContext('2d');

    // game state
    let bird, pipes, score, bestScore, frameId, running, gameOverState;
    const GRAVITY = 0.1;
    const JUMP = -3;
    const PIPE_W = 52;
    const GAP = 135;
    const PIPE_SPEED = 2.0;
    const BIRD_SIZE = 15;

    bestScore = 0;

    function init() {
      bird = { x: 80, y: H / 2, vy: 0 };
      pipes = [];
      score = 0;
      running = false;
      gameOverState = false;
      drawFrame();
      onScore('Skor: 0');
      showOverlay('🐦 Flappy Bird', 'Space / Tıkla = Zıpla', 'Başla');
    }

    function showOverlay(title, msg, btnText) {
      removeOverlay();
      const ov = document.createElement('div');
      ov.className = 'game-overlay';
      ov.id = 'flappyOverlay';
      ov.innerHTML = `<h2>${title}</h2><p>${msg}</p>` +
        (bestScore > 0 ? `<p style="color:var(--accent-cyan)">En İyi: ${bestScore}</p>` : '') +
        `<button class="overlay-btn">${btnText}</button>`;
      ov.querySelector('button').addEventListener('click', () => {
        removeOverlay();
        startGame();
      });
      wrapper.appendChild(ov);
    }

    function removeOverlay() {
      const ov = document.getElementById('flappyOverlay');
      if (ov) ov.remove();
    }

    function startGame() {
      if (gameOverState) {
        bird = { x: 80, y: H / 2, vy: 0 };
        pipes = [];
        score = 0;
        gameOverState = false;
      }
      running = true;
      bird.vy = JUMP;
      lastPipe = 0;
      loop();
    }

    let lastPipe = 0;

    function loop() {
      if (!running) return;
      updateGame();
      drawFrame();
      frameId = requestAnimationFrame(loop);
    }

    function updateGame() {
      // bird physics
      bird.vy += GRAVITY;
      bird.y += bird.vy;

      // ground / ceiling
      if (bird.y + BIRD_SIZE > H) { endGame(); return; }
      if (bird.y < 0) bird.y = 0;

      // spawn pipes
      lastPipe++;
      if (lastPipe > 90) {
        const topH = 50 + Math.random() * (H - GAP - 100);
        pipes.push({ x: W, topH, scored: false });
        lastPipe = 0;
      }

      // move pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        // score
        if (!pipes[i].scored && pipes[i].x + PIPE_W < bird.x) {
          pipes[i].scored = true;
          score++;
          onScore('Skor: ' + score);
        }

        // remove off-screen
        if (pipes[i].x + PIPE_W < 0) pipes.splice(i, 1);
      }

      // collision
      for (const p of pipes) {
        // bird hitbox (circle approx)
        const bx = bird.x, by = bird.y, br = BIRD_SIZE - 2;
        // top pipe
        if (bx + br > p.x && bx - br < p.x + PIPE_W && by - br < p.topH) {
          endGame(); return;
        }
        // bottom pipe
        if (bx + br > p.x && bx - br < p.x + PIPE_W && by + br > p.topH + GAP) {
          endGame(); return;
        }
      }
    }

    function endGame() {
      running = false;
      cancelAnimationFrame(frameId);
      gameOverState = true;
      if (score > bestScore) bestScore = score;
      showOverlay('Oyun Bitti!', `Skor: ${score}`, 'Tekrar Oyna');
    }

    function drawFrame() {
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0a0a2e');
      grad.addColorStop(1, '#1a1a4e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // stars
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137 + 50) % W;
        const sy = (i * 97 + 20) % (H - 50);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // pipes
      for (const p of pipes) {
        // top pipe
        const topGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        topGrad.addColorStop(0, '#1e6b3a');
        topGrad.addColorStop(0.5, '#2ecc71');
        topGrad.addColorStop(1, '#1e6b3a');
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        // pipe cap
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20);

        // bottom pipe
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP);
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(p.x - 4, p.topH + GAP, PIPE_W + 8, 20);
      }

      // bird
      ctx.save();
      ctx.translate(bird.x, bird.y);
      const angle = Math.min(bird.vy * 0.05, 0.5);
      ctx.rotate(angle);

      // glow
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;

      // body
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_SIZE, 0, Math.PI * 2);
      ctx.fill();

      // eye
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(6, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(8, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // beak
      ctx.fillStyle = '#ff6348';
      ctx.beginPath();
      ctx.moveTo(BIRD_SIZE - 2, -3);
      ctx.lineTo(BIRD_SIZE + 10, 0);
      ctx.lineTo(BIRD_SIZE - 2, 5);
      ctx.closePath();
      ctx.fill();

      // wing
      ctx.fillStyle = '#e6b800';
      ctx.beginPath();
      ctx.ellipse(-4, 4, 10, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ground line
      ctx.fillStyle = 'rgba(0,240,255,0.15)';
      ctx.fillRect(0, H - 2, W, 2);
    }

    function jump() {
      if (!running) {
        removeOverlay();
        startGame();
        return;
      }
      bird.vy = JUMP;
    }

    const keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    document.addEventListener('keydown', keyHandler);

    canvas.addEventListener('click', jump);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });

    init();

    return {
      destroy() {
        cancelAnimationFrame(frameId);
        document.removeEventListener('keydown', keyHandler);
      }
    };
  }
};
