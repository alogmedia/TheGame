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
};

const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');
const levelMenu = document.getElementById('level-menu');
const stageSelect = document.getElementById('stage-select');
const coinsDisplay = document.getElementById('coins');

let coins = parseInt(localStorage.getItem('coins') || '0');
coinsDisplay.textContent = `Coins: ${coins}`;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const abilities = [
  { name: 'More Life', apply: p => { const h = p.get(Health); h.max += 20; h.current += 20; } },
  { name: 'Faster Shots', apply: p => { p.get(PlayerControlled).fireRate += 2; } },
  { name: 'Stronger Shots', apply: p => { const pc = p.get(PlayerControlled); pc.bulletDamage += 1; pc.bulletSize += 1; } },
  { name: 'Multi Shot', apply: p => { const pc = p.get(PlayerControlled); pc.shotCount += 1; } },
];

function handleLevelUp(player) {
  game.running = false;
  levelMenu.innerHTML = '';
  levelMenu.classList.remove('hidden');
  const options = shuffle([...abilities]).slice(0, 3);
  options.forEach(ab => {
    const btn = document.createElement('button');
    btn.textContent = ab.name;
    btn.onclick = () => {
      ab.apply(player);
      levelMenu.classList.add('hidden');
      game.start();
    };
    levelMenu.appendChild(btn);
  });
}

game.onStageComplete = () => {
  coins += 100;
  coinsDisplay.textContent = `Coins: ${coins}`;
  localStorage.setItem('coins', coins);
};

game.onGameOver = () => {
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
  .add(new Sprite(30, null, '🧍'))
  .add(new PlayerControlled())
  .add(new Experience())
  .add(new Health(100))
  .add(new Stats());

game.addEntity(player);

startBtn.addEventListener('click', () => {
  if (startBtn.textContent === 'Restart') {
    window.location.reload();
  } else {
    const duration = parseInt(stageSelect.value) * 60;
    stageSystem.setDuration(duration);
    startMenu.classList.add('hidden');
    game.start();
  }
});
