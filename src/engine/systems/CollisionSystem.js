import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { Bullet } from '../components/Bullet.js';
import { Enemy } from '../components/Enemy.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { XPGem } from '../components/XPGem.js';
import { Entity } from '../Entity.js';
import { Health } from '../components/Health.js';
import { Stats } from '../components/Stats.js';

export class CollisionSystem {
  update() {
    const entities = Array.from(this.game.entities);
    const player = entities.find(e => e.has(PlayerControlled));
    const playerStats = player && player.has(Stats) ? player.get(Stats) : null;

    // Bullet vs Enemy
    for (const bullet of entities.filter(e => e.has(Bullet))) {
      const bp = bullet.get(Position);
      const bs = bullet.get(Sprite);
      for (const enemy of entities.filter(e => e.has(Enemy))) {
        const ep = enemy.get(Position);
        const es = enemy.get(Sprite);
        const dist = Math.hypot(bp.x - ep.x, bp.y - ep.y);
        if (dist < bs.size / 2 + es.size / 2) {
          if (playerStats) playerStats.damageDone += bullet.get(Bullet).damage;
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
    if (!player) return;
    const pp = player.get(Position);
    const ps = player.get(Sprite);
    for (const enemy of entities.filter(e => e.has(Enemy))) {
      const ep = enemy.get(Position);
      const es = enemy.get(Sprite);
      const dist = Math.hypot(pp.x - ep.x, pp.y - ep.y);
      if (dist < ps.size / 2 + es.size / 2) {
        const damage = 10;
        if (player.has(Health)) {
          const health = player.get(Health);
          health.current -= damage;
          if (playerStats) playerStats.damageTaken += damage;
          if (health.current <= 0) {
            if (this.game.onGameOver) this.game.onGameOver();
          }
        }
        this.game.removeEntity(enemy);
      }
    }
  }
}
