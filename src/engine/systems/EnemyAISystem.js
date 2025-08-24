import { Enemy } from '../components/Enemy.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { PlayerControlled } from '../components/PlayerControlled.js';

export class EnemyAISystem {
  update() {
    const entities = [...this.game.entities];
    const player = entities.find(e => e.has(PlayerControlled) && e.has(Position));
    if (!player) return;
    const pp = player.get(Position);
    for (const enemy of entities.filter(e => e.has(Enemy) && e.has(Position) && e.has(Velocity))) {
      const ep = enemy.get(Position);
      const ev = enemy.get(Velocity);
      const dx = pp.x - ep.x;
      const dy = pp.y - ep.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = Math.hypot(ev.x, ev.y);
      ev.x = (dx / dist) * speed;
      ev.y = (dy / dist) * speed;
      const ec = enemy.get(Enemy);
      if (!ec.persistent) {
        const maxDist = 1000;
        if (Math.abs(ep.x - pp.x) > maxDist || Math.abs(ep.y - pp.y) > maxDist) {
          this.game.removeEntity(enemy);
        }
      }
    }
  }
}
