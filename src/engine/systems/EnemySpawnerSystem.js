import { Entity } from '../Entity.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { Enemy } from '../components/Enemy.js';

export class EnemySpawnerSystem {
  constructor(interval = 2) {
    this.interval = interval;
    this.timer = 0;
  }
  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = this.interval;
      const canvas = this.game.ctx.canvas;
      const x = Math.random() * canvas.width;
      const enemy = new Entity()
        .add(new Position(x, -20))
        .add(new Velocity(0, 50 + Math.random() * 50))
        .add(new Sprite(20, 'red'))
        .add(new Enemy());
      this.game.addEntity(enemy);
    }
  }
}
