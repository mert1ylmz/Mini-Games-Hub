/* ==========================================
   MAIN – Game Registry & Hub Rendering
   ========================================== */

const GameRegistry = {
  snake: {
    id: 'snake',
    title: 'Snake',
    emoji: '🐍',
    desc: 'Klasik yılan oyunu! Yemleri ye, büyü ama kendine çarpma.',
    accent: 'var(--accent-cyan)',
    create: SnakeGame.create
  },
  tictactoe: {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    emoji: '❌',
    desc: 'AI\'ya karşı XOX oyna. Minimax algoritması ile yenilmez rakip!',
    accent: 'var(--accent-pink)',
    create: TicTacToeGame.create
  },
  memory: {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🃏',
    desc: 'Kartları çevir ve eşlerini bul. Hafızanı test et!',
    accent: 'var(--accent-purple)',
    create: MemoryGame.create
  },
  flappy: {
    id: 'flappy',
    title: 'Flappy Bird',
    emoji: '🐦',
    desc: 'Boruların arasından geç! Basit ama bağımlılık yapıcı.',
    accent: 'var(--accent-orange)',
    create: FlappyGame.create
  },
  game2048: {
    id: 'game2048',
    title: '2048',
    emoji: '🔢',
    desc: 'Sayıları kaydır ve birleştir. Hedef: 2048 taşına ulaşmak!',
    accent: 'var(--accent-green)',
    create: Game2048.create
  }
};

// Build the game cards grid
function buildHub() {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = '';

  Object.values(GameRegistry).forEach((game, index) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.setProperty('--card-accent', game.accent);
    card.style.animationDelay = `${index * 0.08}s`;
    card.innerHTML = `
      <span class="card-emoji" style="animation-delay: ${index * 0.5}s">${game.emoji}</span>
      <h2 class="card-title">${game.title}</h2>
      <p class="card-desc">${game.desc}</p>
      <button class="card-play" style="--card-accent: ${game.accent}; border-color: ${game.accent}; color: ${game.accent}">
        Oyna →
      </button>
    `;
    card.addEventListener('click', () => {
      location.hash = game.id;
    });
    // hover effect on play button
    const btn = card.querySelector('.card-play');
    btn.addEventListener('mouseenter', () => {
      btn.style.background = game.accent;
      btn.style.color = 'var(--bg-1)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
      btn.style.color = game.accent;
    });
    grid.appendChild(card);
  });
}

// Initialize
buildHub();
Router.init();
