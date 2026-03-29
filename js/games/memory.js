/* ==========================================
   MEMORY MATCH GAME
   ========================================== */

const MemoryGame = {
  create(container, onScore) {
    const EMOJIS = ['🎮', '🚀', '🎨', '🎵', '🌟', '🔥', '💎', '🍀'];
    let cards, flipped, matched, moves, lockBoard, startTime, timerInterval;

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';

    const stats = document.createElement('div');
    stats.className = 'memory-stats';
    stats.innerHTML = `
      <div>Hamle: <span id="memMoves">0</span></div>
      <div>Süre: <span id="memTime">0s</span></div>
      <div>Eşleşme: <span id="memMatched">0</span>/8</div>
    `;

    const boardEl = document.createElement('div');
    boardEl.className = 'memory-board';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-btn';
    restartBtn.textContent = '🔄 Yeni Oyun';
    restartBtn.addEventListener('click', init);

    wrap.append(stats, boardEl, restartBtn);
    container.appendChild(wrap);

    function init() {
      clearInterval(timerInterval);
      flipped = [];
      matched = 0;
      moves = 0;
      lockBoard = false;
      startTime = null;

      // create pairs & shuffle
      const pairs = [...EMOJIS, ...EMOJIS];
      cards = pairs.sort(() => Math.random() - 0.5).map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false
      }));

      renderBoard();
      updateStats();
      onScore('Hamle: 0');
    }

    function renderBoard() {
      boardEl.innerHTML = '';
      cards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'memory-card' + (card.flipped ? ' flipped' : '') + (card.matched ? ' matched' : '');
        el.innerHTML = `
          <div class="memory-card-inner">
            <div class="memory-card-front">❓</div>
            <div class="memory-card-back">${card.emoji}</div>
          </div>
        `;
        el.addEventListener('click', () => flipCard(card.id));
        boardEl.appendChild(el);
      });
    }

    function flipCard(id) {
      if (lockBoard) return;
      const card = cards[id];
      if (card.flipped || card.matched) return;

      if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
      }

      card.flipped = true;
      flipped.push(id);
      renderBoard();

      if (flipped.length === 2) {
        moves++;
        lockBoard = true;
        const [a, b] = flipped;

        if (cards[a].emoji === cards[b].emoji) {
          cards[a].matched = true;
          cards[b].matched = true;
          matched++;
          flipped = [];
          lockBoard = false;
          renderBoard();
          updateStats();

          if (matched === EMOJIS.length) {
            clearInterval(timerInterval);
            onScore(`🎉 ${moves} hamle`);
          }
        } else {
          setTimeout(() => {
            cards[a].flipped = false;
            cards[b].flipped = false;
            flipped = [];
            lockBoard = false;
            renderBoard();
          }, 800);
        }
        updateStats();
      }
    }

    function updateTimer() {
      if (!startTime) return;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('memTime').textContent = elapsed + 's';
    }

    function updateStats() {
      document.getElementById('memMoves').textContent = moves;
      document.getElementById('memMatched').textContent = matched;
      onScore(`Hamle: ${moves}`);
    }

    init();

    return {
      destroy() {
        clearInterval(timerInterval);
      }
    };
  }
};
