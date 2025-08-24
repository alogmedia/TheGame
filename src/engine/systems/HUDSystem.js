import { Health } from '../components/Health.js';
import { Experience } from '../components/Experience.js';
import { Stats } from '../components/Stats.js';
import { PlayerControlled } from '../components/PlayerControlled.js';

export class HUDSystem {
  constructor(hud) {
    this.hud = hud;
  }

  update() {
    const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Health) && e.has(Experience));
    if (!player) return;
    const health = player.get(Health);
    const exp = player.get(Experience);
    const stats = player.has(Stats) ? player.get(Stats) : null;
    this.hud.health.style.width = `${(health.current / health.max) * 100}%`;
    this.hud.xp.style.width = `${(exp.xp / exp.nextLevelXp) * 100}%`;
    if (stats) {
      this.hud.stats.textContent = `Damage Done: ${stats.damageDone} Damage Taken: ${stats.damageTaken}`;
    }
  }
}
