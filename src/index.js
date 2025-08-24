import { Game } from './engine/Game.js';
import { Entity } from './engine/Entity.js';
import { Position } from './engine/components/Position.js';
import { Velocity } from './engine/components/Velocity.js';
import { Sprite } from './engine/components/Sprite.js';
import { PlayerControlled } from './engine/components/PlayerControlled.js';
import { MovementSystem } from './engine/systems/MovementSystem.js';
import { RenderSystem } from './engine/systems/RenderSystem.js';
import { PlayerControlSystem } from './engine/systems/PlayerControlSystem.js';
import { BulletSystem } from './engine/systems/BulletSystem.js';
import { EnemySpawnerSystem } from './engine/systems/EnemySpawnerSystem.js';
import { CollisionSystem } from './engine/systems/CollisionSystem.js';
import { Input } from './input.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const game = new Game(ctx);

const input = new Input(canvas);

// Systems order matters: movement before render
game.addSystem(new MovementSystem());
game.addSystem(new BulletSystem());
game.addSystem(new EnemySpawnerSystem());
game.addSystem(new PlayerControlSystem(input));
game.addSystem(new CollisionSystem());
game.addSystem(new RenderSystem());

const player = new Entity()
  .add(new Position(canvas.width / 2, canvas.height / 2))
  .add(new Velocity())
  .add(new Sprite(20, 'cyan'))
  .add(new PlayerControlled());

game.addEntity(player);

game.start();
