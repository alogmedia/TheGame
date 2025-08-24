import { Entity } from '../Entity.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { Enemy } from '../components/Enemy.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Health } from '../components/Health.js';

const EMOJIS = ['👻', '👽', '😈', '💀', '🧟', '🤡', '👹', '👺'];

export class EnemySpawnerSystem {
  constructor(interval = 2) {
    this.interval = interval;
    this.timer = 0;
  }
  update(dt) {
    this.timer -= dt;
    const spawnInterval = Math.max(0.5, this.interval - this.game.elapsed / 60);
    if (this.timer <= 0) {
      this.timer = spawnInterval;
      const count = 1 + Math.floor(this.game.elapsed / 60);
      for (let i = 0; i < count; i++) {
        const canvas = this.game.ctx.canvas;
        const side = Math.floor(Math.random() * 4);
        let x, y;
        if (side === 0) { // top
          x = Math.random() * canvas.width;
          y = -20;
        } else if (side === 1) { // bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 20;
        } else if (side === 2) { // left
          x = -20;
          y = Math.random() * canvas.height;
        } else { // right
          x = canvas.width + 20;
          y = Math.random() * canvas.height;
        }
        const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Position));
        if (!player) return;
        const pp = player.get(Position);
        const dx = pp.x - x;
        const dy = pp.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = 30 + Math.random() * 30;
        const health = 1 + Math.floor(this.game.elapsed / 30);
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const enemy = new Entity()
          .add(new Position(x, y))
          .add(new Velocity((dx / dist) * speed, (dy / dist) * speed))
          .add(new Sprite(30, null, emoji))
          .add(new Enemy())
          .add(new Health(health));
        this.game.addEntity(enemy);
      }
    }
  }
}
