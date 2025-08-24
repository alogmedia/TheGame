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
        const cam = this.game.camera || { x: 0, y: 0 };
        const target = {
          x: this.input.mouse.x + cam.x,
          y: this.input.mouse.y + cam.y
        };
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.hypot(dx, dy);
        let dirX = pc.dirX;
        let dirY = pc.dirY;
        if (dist > 0) {
          dirX = dx / dist;
          dirY = dy / dist;
          v.x = dirX * pc.speed;
          v.y = dirY * pc.speed;
          pc.dirX = dirX;
          pc.dirY = dirY;
        } else {
          v.x = 0;
          v.y = 0;
        }
        pc.cooldown -= dt;
        if (pc.cooldown <= 0) {
          this.spawnBullet(entity, dirX, dirY);
          pc.cooldown = 1 / pc.fireRate;
        }
      }
    }
  }

  spawnBullet(player, dirX, dirY) {
    const pc = player.get(PlayerControlled);
    const p = player.get(Position);
    const baseAngle = Math.atan2(dirY, dirX);
    for (let i = 0; i < pc.shotCount; i++) {
      const spread = (i - (pc.shotCount - 1) / 2) * 0.1;
      const angle = baseAngle + spread;
      const vx = Math.cos(angle) * pc.bulletSpeed;
      const vy = Math.sin(angle) * pc.bulletSpeed;
      const bullet = new Entity()
        .add(new Position(p.x + Math.cos(angle) * 15, p.y + Math.sin(angle) * 15))
        .add(new Velocity(vx, vy))
        .add(new Sprite(pc.bulletSize, 'yellow'))
        .add(new Bullet(2, pc.bulletDamage));
      this.game.addEntity(bullet);
    }
  }
}
