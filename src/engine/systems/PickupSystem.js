import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { XPGem } from '../components/XPGem.js';
import { Experience } from '../components/Experience.js';
import { PlayerControlled } from '../components/PlayerControlled.js';

export class PickupSystem {
  constructor(onLevelUp) {
    this.onLevelUp = onLevelUp;
  }
  update() {
    const entities = Array.from(this.game.entities);
    const player = entities.find(e => e.has(PlayerControlled) && e.has(Position) && e.has(Experience));
    if (!player) return;
    const pp = player.get(Position);
    const ps = player.get(Sprite);
    const exp = player.get(Experience);

    for (const gem of entities.filter(e => e.has(XPGem) && e.has(Position))) {
      const gp = gem.get(Position);
      const gs = gem.get(Sprite);
      const dist = Math.hypot(pp.x - gp.x, pp.y - gp.y);
      if (dist < ps.size / 2 + gs.size / 2) {
        exp.xp += gem.get(XPGem).value;
        let leveled = false;
        while (exp.xp >= exp.nextLevelXp) {
          exp.xp -= exp.nextLevelXp;
          exp.level++;
          exp.nextLevelXp = Math.floor(exp.nextLevelXp * 1.5);
          leveled = true;
        }
        if (leveled && this.onLevelUp) this.onLevelUp(player);
        this.game.removeEntity(gem);
      }
    }
  }
}
