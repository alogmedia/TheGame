import { Game } from './engine/Game.js';
import { Entity } from './engine/Entity.js';
import { Position } from './engine/components/Position.js';
import { Velocity } from './engine/components/Velocity.js';
import { Sprite } from './engine/components/Sprite.js';
import { PlayerControlled } from './engine/components/PlayerControlled.js';
import { Experience } from './engine/components/Experience.js';
import { Health } from './engine/components/Health.js';
import { Stats } from './engine/components/Stats.js';
import { MovementSystem } from './engine/systems/MovementSystem.js';
import { RenderSystem } from './engine/systems/RenderSystem.js';
import { PlayerControlSystem } from './engine/systems/PlayerControlSystem.js';
import { BulletSystem } from './engine/systems/BulletSystem.js';
import { EnemySpawnerSystem } from './engine/systems/EnemySpawnerSystem.js';
import { CollisionSystem } from './engine/systems/CollisionSystem.js';
import { PickupSystem } from './engine/systems/PickupSystem.js';
import { HUDSystem } from './engine/systems/HUDSystem.js';
import { EnemyAISystem } from './engine/systems/EnemyAISystem.js';
import { StageSystem } from './engine/systems/StageSystem.js';
import { Input } from './input.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
const game = new Game(ctx);
const input = new Input(canvas);

const hud = {
  xp: document.getElementById('xp-fill'),
  stats: document.getElementById('stats'),
  coins: document.getElementById('coin-count'),
  score: document.getElementById('score'),
  timer: document.getElementById('timer'),
};

const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');
const newBtn = document.getElementById('new-btn');
const shopBtn = document.getElementById('shop-btn');
const scoreboardBtn = document.getElementById('scoreboard-btn');
const levelMenu = document.getElementById('level-menu');
const levelOptions = document.getElementById('level-options');
const stageSelect = document.getElementById('stage-select');
const coinsDisplay = document.getElementById('coins');
const shopMenu = document.getElementById('shop-menu');
const shopItemsDiv = document.getElementById('shop-items');
const shopClose = document.getElementById('shop-close');
const scoreboardMenu = document.getElementById('scoreboard-menu');
const scoreList = document.getElementById('score-list');
const scoreClose = document.getElementById('score-close');
let coins = parseInt(localStorage.getItem('coins') || '0');
let purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
let scores = JSON.parse(localStorage.getItem('scores') || '[]');
coinsDisplay.textContent = `Coins: ${coins}`;
game.coins = coins;
game.score = 0;
game.onCoinsChange = c => {
  coins = c;
  coinsDisplay.textContent = `Coins: ${coins}`;
  if (hud.coins) hud.coins.textContent = `Coins: ${coins}`;
  localStorage.setItem('coins', coins);
};
if (hud.coins) hud.coins.textContent = `Coins: ${coins}`;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const abilities = [
  {
    name: 'More Life',
    icon: '❤️',
    desc: 'Increase max health by 20.',
    apply: p => {
      const h = p.get(Health);
      h.max += 20;
      h.current += 20;
    }
  },
  {
    name: 'Faster Shots',
    icon: '⚡',
    desc: 'Shoot more rapidly.',
    apply: p => { p.get(PlayerControlled).fireRate += 2; }
  },
  {
    name: 'Stronger Shots',
    icon: '🔥',
    desc: 'Increase bullet damage and size.',
    apply: p => {
      const pc = p.get(PlayerControlled);
      pc.bulletDamage += 1;
      pc.bulletSize += 1;
    }
  },
  {
    name: 'Multi Shot',
    icon: '🎯',
    desc: 'Fire an additional bullet.',
    apply: p => { p.get(PlayerControlled).shotCount += 1; }
  },
];

const shopItems = [
  {
    id: 'health',
    name: '+20 Max Health',
    cost: 50,
    apply: p => {
      const h = p.get(Health);
      h.max += 20;
      h.current += 20;
    }
  },
  {
    id: 'damage',
    name: '+1 Bullet Damage',
    cost: 50,
    apply: p => {
      p.get(PlayerControlled).bulletDamage += 1;
    }
  },
  {
    id: 'firerate',
    name: '+1 Fire Rate',
    cost: 50,
    apply: p => {
      p.get(PlayerControlled).fireRate += 1;
    }
  }
];

function openShop() {
  shopItemsDiv.innerHTML = '';
  shopItems.forEach(item => {
    const btn = document.createElement('button');
    const owned = purchases[item.id];
    btn.textContent = owned ? `${item.name} (Bought)` : `${item.name} - ${item.cost}`;
    btn.disabled = owned || game.coins < item.cost;
    btn.onclick = () => {
      if (game.coins >= item.cost && !purchases[item.id]) {
        game.coins -= item.cost;
        if (game.onCoinsChange) game.onCoinsChange(game.coins);
        purchases[item.id] = true;
        localStorage.setItem('purchases', JSON.stringify(purchases));
        item.apply(player);
        btn.textContent = `${item.name} (Bought)`;
        btn.disabled = true;
      }
    };
    shopItemsDiv.appendChild(btn);
  });
  shopMenu.classList.remove('hidden');
}
shopBtn.onclick = openShop;
shopClose.onclick = () => shopMenu.classList.add('hidden');

function updateScoreboard() {
  scoreList.innerHTML = '';
  scores.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${s}`;
    scoreList.appendChild(li);
  });
}
scoreboardBtn.onclick = () => {
  updateScoreboard();
  scoreboardMenu.classList.remove('hidden');
};
scoreClose.onclick = () => scoreboardMenu.classList.add('hidden');

function handleLevelUp(player) {
  game.running = false;
  levelOptions.innerHTML = '';
  levelMenu.classList.remove('hidden');
  const options = shuffle([...abilities]).slice(0, 3);
  options.forEach(ab => {
    const btn = document.createElement('button');
    btn.className = 'level-option';
    btn.innerHTML = `
      <span class="icon">${ab.icon}</span>
      <div class="info">
        <div class="name">${ab.name}</div>
        <div class="desc">${ab.desc}</div>
      </div>`;
    btn.onclick = () => {
      ab.apply(player);
      levelMenu.classList.add('hidden');
      game.start();
    };
    levelOptions.appendChild(btn);
  });
}

game.onStageComplete = () => {
  game.coins += 100;
  if (game.onCoinsChange) game.onCoinsChange(game.coins);
};

game.onGameOver = () => {
  scores.push(game.score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 10);
  localStorage.setItem('scores', JSON.stringify(scores));
  startBtn.textContent = 'Restart';
  startMenu.classList.remove('hidden');
  game.running = false;
};

// Systems order
game.addSystem(new EnemyAISystem());
const stageSystem = new StageSystem();
game.addSystem(stageSystem);
game.addSystem(new PlayerControlSystem(input));
game.addSystem(new MovementSystem());
game.addSystem(new BulletSystem());
game.addSystem(new EnemySpawnerSystem());
game.addSystem(new PickupSystem(handleLevelUp));
game.addSystem(new CollisionSystem());
game.addSystem(new HUDSystem(hud));
game.addSystem(new RenderSystem());

const player = new Entity()
  .add(new Position(canvas.width / 2, canvas.height / 2))
  .add(new Velocity())
  .add(new Sprite(40, null, '🧍'))
  .add(new PlayerControlled())
  .add(new Experience())
  .add(new Health(100))
  .add(new Stats());

for (const item of shopItems) {
  if (purchases[item.id]) item.apply(player);
}

game.addEntity(player);

startBtn.addEventListener('click', () => {
  if (startBtn.textContent === 'Restart') {
    window.location.reload();
  } else {
    const duration = parseInt(stageSelect.value) * 60;
    stageSystem.setDuration(duration);
    startMenu.classList.add('hidden');
    game.score = 0;
    if (hud.score) hud.score.textContent = 'Score: 0';
    game.start();
  }
});

newBtn.addEventListener('click', () => {
  localStorage.removeItem('coins');
  localStorage.removeItem('purchases');
  localStorage.removeItem('scores');
  window.location.reload();
});
