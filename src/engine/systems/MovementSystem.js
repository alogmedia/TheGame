import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';

export class MovementSystem {
  update(dt) {
    for (const entity of this.game.entities) {
      if (entity.has(Position) && entity.has(Velocity)) {
        const p = entity.get(Position);
        const v = entity.get(Velocity);
        p.x += v.x * dt;
        p.y += v.y * dt;
      }
    }
  }
}
