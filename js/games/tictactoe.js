/* ==========================================
   TIC-TAC-TOE GAME (vs AI – minimax)
   ========================================== */

const TicTacToeGame = {
  create(container, onScore) {
    let board, isPlayerTurn, gameActive, playerWins, aiWins;
    playerWins = 0;
    aiWins = 0;

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';

    const status = document.createElement('div');
    status.className = 'ttt-status';

    const boardEl = document.createElement('div');
    boardEl.className = 'ttt-board';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'ttt-restart';
    restartBtn.textContent = '🔄 Yeni Oyun';
    restartBtn.addEventListener('click', init);

    wrap.append(status, boardEl, restartBtn);
    container.appendChild(wrap);

    function init() {
      board = Array(9).fill(null);
      isPlayerTurn = true;
      gameActive = true;
      status.textContent = 'Senin sıran (X)';
      renderBoard();
      updateScoreDisplay();
    }

    function renderBoard() {
      boardEl.innerHTML = '';
      board.forEach((v, i) => {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell' + (v === 'X' ? ' x taken' : v === 'O' ? ' o taken' : '');
        cell.textContent = v || '';
        cell.addEventListener('click', () => handleClick(i));
        boardEl.appendChild(cell);
      });
    }

    function handleClick(i) {
      if (!gameActive || !isPlayerTurn || board[i]) return;
      board[i] = 'X';
      if (checkEnd()) return;
      isPlayerTurn = false;
      status.textContent = 'AI düşünüyor...';
      renderBoard();
      setTimeout(aiMove, 350);
    }

    function aiMove() {
      const move = bestMove();
      if (move !== null) board[move] = 'O';
      isPlayerTurn = true;
      if (!checkEnd()) {
        status.textContent = 'Senin sıran (X)';
      }
      renderBoard();
    }

    function checkEnd() {
      const winner = getWinner(board);
      if (winner) {
        gameActive = false;
        const cells = boardEl.querySelectorAll('.ttt-cell');
        getWinLine(board).forEach(i => cells[i]?.classList.add('win-cell'));
        if (winner === 'X') {
          status.textContent = '🎉 Kazandın!';
          playerWins++;
        } else {
          status.textContent = '🤖 AI Kazandı!';
          aiWins++;
        }
        updateScoreDisplay();
        renderBoard();
        // highlight winning cells after re-render
        setTimeout(() => {
          const newCells = boardEl.querySelectorAll('.ttt-cell');
          getWinLine(board).forEach(i => newCells[i]?.classList.add('win-cell'));
        }, 0);
        return true;
      }
      if (board.every(c => c !== null)) {
        gameActive = false;
        status.textContent = '🤝 Berabere!';
        renderBoard();
        return true;
      }
      return false;
    }

    function updateScoreDisplay() {
      onScore(`Sen ${playerWins} – ${aiWins} AI`);
    }

    const LINES = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    function getWinner(b) {
      for (const [a, bb, c] of LINES) {
        if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
      }
      return null;
    }

    function getWinLine(b) {
      for (const line of LINES) {
        const [a, bb, c] = line;
        if (b[a] && b[a] === b[bb] && b[a] === b[c]) return line;
      }
      return [];
    }

    function minimax(b, isMax, depth) {
      const w = getWinner(b);
      if (w === 'O') return 10 - depth;
      if (w === 'X') return depth - 10;
      if (b.every(c => c !== null)) return 0;

      let best = isMax ? -Infinity : Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i]) continue;
        b[i] = isMax ? 'O' : 'X';
        const val = minimax(b, !isMax, depth + 1);
        b[i] = null;
        best = isMax ? Math.max(best, val) : Math.min(best, val);
      }
      return best;
    }

    function bestMove() {
      let best = -Infinity, move = null;
      for (let i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = 'O';
        const val = minimax(board, false, 0);
        board[i] = null;
        if (val > best) { best = val; move = i; }
      }
      return move;
    }

    init();

    return { destroy() {} };
  }
};
