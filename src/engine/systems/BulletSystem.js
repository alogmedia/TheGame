import { Bullet } from '../components/Bullet.js';
import { Position } from '../components/Position.js';

export class BulletSystem {
  update(dt) {
    for (const entity of Array.from(this.game.entities)) {
      if (entity.has(Bullet) && entity.has(Position)) {
        const b = entity.get(Bullet);
        const p = entity.get(Position);
        b.life -= dt;
        const canvas = this.game.ctx.canvas;
        if (
          b.life <= 0 ||
          p.x < -10 ||
          p.y < -10 ||
          p.x > canvas.width + 10 ||
          p.y > canvas.height + 10
        ) {
          this.game.removeEntity(entity);
        }
      }
    }
  }
}
