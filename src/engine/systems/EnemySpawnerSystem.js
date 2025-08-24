import { Entity } from '../Entity.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { Enemy } from '../components/Enemy.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Health } from '../components/Health.js';

const EMOJIS = ['👻', '👽', '😈', '💀', '🧟', '🤡', '👹', '👺'];

export class EnemySpawnerSystem {
  constructor(interval = 1) {
    this.interval = interval;
    this.timer = 0;
  }
  update(dt) {
    this.timer -= dt;
    const spawnInterval = Math.max(0.3, this.interval - this.game.elapsed / 90);
    if (this.timer <= 0) {
      this.timer = spawnInterval;
      const enemiesAlive = [...this.game.entities].filter(e => e.has(Enemy)).length;
      if (enemiesAlive >= 300) return;
      const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Position));
      if (!player) return;
      const pp = player.get(Position);
      const canvas = this.game.ctx.canvas;
      const radius = Math.max(canvas.width, canvas.height) / 2 + 40;
      const count = 1 + Math.floor(this.game.elapsed / 60);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const x = pp.x + Math.cos(angle) * radius;
        const y = pp.y + Math.sin(angle) * radius;
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
