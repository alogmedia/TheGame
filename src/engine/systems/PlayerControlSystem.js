import { Entity } from '../Entity.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Bullet } from '../components/Bullet.js';

export class PlayerControlSystem {
  constructor(input) {
    this.input = input;
  }

  update(dt) {
    for (const entity of this.game.entities) {
      if (entity.has(PlayerControlled) && entity.has(Velocity)) {
        const pc = entity.get(PlayerControlled);
        const v = entity.get(Velocity);
        v.x = 0; v.y = 0;
        if (this.input.isDown('w') || this.input.isDown('arrowup')) v.y -= pc.speed;
        if (this.input.isDown('s') || this.input.isDown('arrowdown')) v.y += pc.speed;
        if (this.input.isDown('a') || this.input.isDown('arrowleft')) v.x -= pc.speed;
        if (this.input.isDown('d') || this.input.isDown('arrowright')) v.x += pc.speed;
        const mag = Math.hypot(v.x, v.y);
        if (mag > 0) {
          v.x = (v.x / mag) * pc.speed;
          v.y = (v.y / mag) * pc.speed;
        }
        pc.cooldown -= dt;
        if (pc.cooldown <= 0) {
          this.spawnBullet(entity);
          pc.cooldown = 1 / pc.fireRate;
        }
      }
    }
  }

  spawnBullet(player) {
    const p = player.get(Position);
    const bullet = new Entity()
      .add(new Position(p.x, p.y - 15))
      .add(new Velocity(0, -400))
      .add(new Sprite(4, 'yellow'))
      .add(new Bullet());
    this.game.addEntity(bullet);
  }
}
