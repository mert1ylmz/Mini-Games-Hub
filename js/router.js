/* ==========================================
   ROUTER – Simple hash-based SPA router
   ========================================== */

const Router = {
  hub: document.getElementById('hub'),
  gamePage: document.getElementById('gamePage'),
  gameContainer: document.getElementById('gameContainer'),
  gameTitle: document.getElementById('gameTitle'),
  gameScore: document.getElementById('gameScore'),
  backBtn: document.getElementById('backBtn'),
  currentGame: null,

  init() {
    this.backBtn.addEventListener('click', () => this.goHome());
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = location.hash.slice(1);
    if (hash && GameRegistry[hash]) {
      this.showGame(hash);
    } else {
      this.showHub();
    }
  },

  showHub() {
    if (this.currentGame && this.currentGame.destroy) {
      this.currentGame.destroy();
    }
    this.currentGame = null;
    this.gamePage.classList.remove('active');
    this.hub.classList.add('active');
    this.gameContainer.innerHTML = '';
    this.gameScore.textContent = '';
    location.hash = '';
  },

  showGame(id) {
    const game = GameRegistry[id];
    if (!game) return;

    if (this.currentGame && this.currentGame.destroy) {
      this.currentGame.destroy();
    }

    this.hub.classList.remove('active');
    this.gamePage.classList.add('active');
    this.gameTitle.textContent = game.emoji + ' ' + game.title;
    this.gameContainer.innerHTML = '';
    this.gameScore.textContent = '';

    this.currentGame = game.create(this.gameContainer, (score) => {
      this.gameScore.textContent = score;
    });
  },

  goHome() {
    location.hash = '';
  },

  updateScore(text) {
    this.gameScore.textContent = text;
  }
};
