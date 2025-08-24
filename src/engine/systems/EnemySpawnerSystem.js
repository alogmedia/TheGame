import { Entity } from '../Entity.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { Enemy } from '../components/Enemy.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Health } from '../components/Health.js';

const EMOJIS = ['👻', '👽', '😈', '💀', '🧟', '🤡', '👹', '👺'];

export class EnemySpawnerSystem {
  constructor(interval = 0.8) {
    this.interval = interval;
    this.timer = 0;
  }
  update(dt) {
    this.timer -= dt;
    const spawnInterval = Math.max(0.2, this.interval - this.game.elapsed / 120);
    if (this.timer <= 0) {
      this.timer = spawnInterval;
      const enemiesAlive = [...this.game.entities].filter(e => e.has(Enemy)).length;
      if (enemiesAlive >= 300) return;
      const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Position));
      if (!player) return;
      const pp = player.get(Position);
      const canvas = this.game.ctx.canvas;
      const halfW = canvas.width / 2;
      const halfH = canvas.height / 2;
      const margin = 40;
      const count = 1 + Math.floor(this.game.elapsed / 45);
      for (let i = 0; i < count; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        if (side === 0) { // top
          x = pp.x - halfW + Math.random() * canvas.width;
          y = pp.y - halfH - margin;
        } else if (side === 1) { // bottom
          x = pp.x - halfW + Math.random() * canvas.width;
          y = pp.y + halfH + margin;
        } else if (side === 2) { // left
          x = pp.x - halfW - margin;
          y = pp.y - halfH + Math.random() * canvas.height;
        } else { // right
          x = pp.x + halfW + margin;
          y = pp.y - halfH + Math.random() * canvas.height;
        }
        const dx = pp.x - x;
        const dy = pp.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = 40 + Math.random() * 40;
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
