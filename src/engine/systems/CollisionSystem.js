import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { Bullet } from '../components/Bullet.js';
import { Enemy } from '../components/Enemy.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { XPGem } from '../components/XPGem.js';
import { Entity } from '../Entity.js';

export class CollisionSystem {
  update() {
    const entities = Array.from(this.game.entities);
    // Bullet vs Enemy
    for (const bullet of entities.filter(e => e.has(Bullet))) {
      const bp = bullet.get(Position);
      const bs = bullet.get(Sprite);
      for (const enemy of entities.filter(e => e.has(Enemy))) {
        const ep = enemy.get(Position);
        const es = enemy.get(Sprite);
        const dist = Math.hypot(bp.x - ep.x, bp.y - ep.y);
        if (dist < bs.size / 2 + es.size / 2) {
          this.game.removeEntity(bullet);
          this.game.removeEntity(enemy);
          const gem = new Entity()
            .add(new Position(ep.x, ep.y))
            .add(new Sprite(6, 'green'))
            .add(new XPGem());
          this.game.addEntity(gem);
          break;
        }
      }
    }
    // Enemy vs Player
    const player = entities.find(e => e.has(PlayerControlled));
    if (!player) return;
    const pp = player.get(Position);
    const ps = player.get(Sprite);
    for (const enemy of entities.filter(e => e.has(Enemy))) {
      const ep = enemy.get(Position);
      const es = enemy.get(Sprite);
      const dist = Math.hypot(pp.x - ep.x, pp.y - ep.y);
      if (dist < ps.size / 2 + es.size / 2) {
        console.log('Game Over');
        for (const ent of entities) {
          if (ent !== player) this.game.removeEntity(ent);
        }
        break;
      }
    }
  }
}
