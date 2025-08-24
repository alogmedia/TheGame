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
      if (entity.has(PlayerControlled) && entity.has(Velocity) && entity.has(Position)) {
        const pc = entity.get(PlayerControlled);
        const v = entity.get(Velocity);
        const p = entity.get(Position);
        const target = this.input.mouse;
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const dirX = dx / dist;
          const dirY = dy / dist;
          v.x = dirX * pc.speed;
          v.y = dirY * pc.speed;
          pc.cooldown -= dt;
          if (pc.cooldown <= 0) {
            this.spawnBullet(entity, dirX, dirY);
            pc.cooldown = 1 / pc.fireRate;
          }
        } else {
          v.x = 0;
          v.y = 0;
        }
      }
    }
  }

  spawnBullet(player, dirX, dirY) {
    const p = player.get(Position);
    const speed = 400;
    const bullet = new Entity()
      .add(new Position(p.x + dirX * 15, p.y + dirY * 15))
      .add(new Velocity(dirX * speed, dirY * speed))
      .add(new Sprite(4, 'yellow'))
      .add(new Bullet());
    this.game.addEntity(bullet);
  }
}
