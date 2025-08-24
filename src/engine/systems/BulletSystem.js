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
        const cam = this.game.camera || { x: 0, y: 0 };
        if (
          b.life <= 0 ||
          p.x < cam.x - 10 ||
          p.y < cam.y - 10 ||
          p.x > cam.x + canvas.width + 10 ||
          p.y > cam.y + canvas.height + 10
        ) {
          this.game.removeEntity(entity);
        }
      }
    }
  }
}
