import { Bullet } from '../components/Bullet.js';
import { Position } from '../components/Position.js';

export class BulletSystem {
  update(dt) {
    for (const entity of Array.from(this.game.entities)) {
      if (entity.has(Bullet) && entity.has(Position)) {
        const b = entity.get(Bullet);
        const p = entity.get(Position);
        b.life -= dt;
        if (b.life <= 0 || p.y < -10) {
          this.game.removeEntity(entity);
        }
      }
    }
  }
}
