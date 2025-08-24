import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { XPGem } from '../components/XPGem.js';
import { Experience } from '../components/Experience.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Coin } from '../components/Coin.js';

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

    for (const coin of entities.filter(e => e.has(Coin) && e.has(Position))) {
      const cp = coin.get(Position);
      const cs = coin.get(Sprite);
      const dist = Math.hypot(pp.x - cp.x, pp.y - cp.y);
      if (dist < ps.size / 2 + cs.size / 2) {
        this.game.coins = (this.game.coins || 0) + coin.get(Coin).value;
        if (this.game.onCoinsChange) this.game.onCoinsChange(this.game.coins);
        this.game.removeEntity(coin);
      }
    }
  }
}
