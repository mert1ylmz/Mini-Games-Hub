/* ==========================================
   2048 GAME
   ========================================== */

const Game2048 = {
  create(container, onScore) {
    let grid, score, best, moved;
    best = 0;

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';

    const scorePanel = document.createElement('div');
    scorePanel.className = 'game-2048-score';
    scorePanel.innerHTML = `
      <div><label>Skor</label><span class="value" id="score2048">0</span></div>
      <div><label>En İyi</label><span class="value" id="best2048">0</span></div>
    `;

    const boardEl = document.createElement('div');
    boardEl.className = 'grid-2048';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-btn';
    restartBtn.textContent = '🔄 Yeni Oyun';
    restartBtn.addEventListener('click', init);

    const hint = document.createElement('div');
    hint.className = 'mobile-hint';
    hint.textContent = 'Yön tuşları veya kaydırma ile oyna';

    wrap.append(scorePanel, boardEl, restartBtn, hint);
    container.appendChild(wrap);

    function init() {
      grid = Array.from({ length: 4 }, () => Array(4).fill(0));
      score = 0;
      addRandom();
      addRandom();
      render();
      updateScoreDisplay();
    }

    function addRandom() {
      const empty = [];
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
          if (grid[r][c] === 0) empty.push([r, c]);
      if (empty.length === 0) return;
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
      boardEl.innerHTML = '';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const v = grid[r][c];
          const tile = document.createElement('div');
          tile.className = 'tile-2048' + (v ? ` t${v}` : '');
          tile.textContent = v || '';
          boardEl.appendChild(tile);
        }
      }
    }

    function updateScoreDisplay() {
      if (score > best) best = score;
      const scoreEl = document.getElementById('score2048');
      const bestEl = document.getElementById('best2048');
      if (scoreEl) scoreEl.textContent = score;
      if (bestEl) bestEl.textContent = best;
      onScore(`Skor: ${score}`);
    }

    function slideRow(row) {
      let arr = row.filter(v => v !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(v => v !== 0);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    function move(direction) {
      let changed = false;
      const prev = grid.map(r => [...r]);

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) grid[r] = slideRow(grid[r]);
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) grid[r] = slideRow(grid[r].reverse()).reverse();
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
          col = slideRow(col);
          for (let r = 0; r < 4; r++) grid[r][c] = col[r];
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
          col = slideRow(col);
          for (let r = 0; r < 4; r++) grid[3 - r][c] = col[r];
        }
      }

      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
          if (grid[r][c] !== prev[r][c]) changed = true;

      if (changed) {
        addRandom();
        render();
        updateScoreDisplay();
        // animate new tiles
        const tiles = boardEl.querySelectorAll('.tile-2048');
        tiles.forEach(t => {
          if (t.textContent && !prev.flat().includes(0)) return;
        });

        if (isGameOver()) {
          setTimeout(() => onScore(`Oyun Bitti! Skor: ${score}`), 200);
        }
      }
    }

    function isGameOver() {
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) return false;
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
      return true;
    }

    const keyHandler = (e) => {
      const map = {
        ArrowLeft: 'left', ArrowRight: 'right',
        ArrowUp: 'up', ArrowDown: 'down',
        a: 'left', d: 'right', w: 'up', s: 'down'
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    document.addEventListener('keydown', keyHandler);

    // Swipe support
    let touchStart = null;
    const tsHandler = (e) => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const teHandler = (e) => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
      touchStart = null;
    };
    boardEl.addEventListener('touchstart', tsHandler, { passive: true });
    boardEl.addEventListener('touchend', teHandler);

    init();

    return {
      destroy() {
        document.removeEventListener('keydown', keyHandler);
        boardEl.removeEventListener('touchstart', tsHandler);
        boardEl.removeEventListener('touchend', teHandler);
      }
    };
  }
};
