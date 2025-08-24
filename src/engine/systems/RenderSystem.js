import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Health } from '../components/Health.js';

export class RenderSystem {
  update() {
    const ctx = this.game.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const entity of this.game.entities) {
      if (entity.has(Position) && entity.has(Sprite)) {
        const p = entity.get(Position);
        const s = entity.get(Sprite);
        if (s.emoji) {
          ctx.font = `${s.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.emoji, p.x, p.y);
        } else {
          ctx.fillStyle = s.color;
          ctx.fillRect(p.x - s.size / 2, p.y - s.size / 2, s.size, s.size);
        }
        if (entity.has(PlayerControlled) && entity.has(Health)) {
          const h = entity.get(Health);
          const barWidth = 40;
          const barHeight = 5;
          const x = p.x - barWidth / 2;
          const y = p.y - s.size / 2 - 10;
          ctx.fillStyle = 'red';
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.fillStyle = 'green';
          ctx.fillRect(x, y, barWidth * (h.current / h.max), barHeight);
        }
      }
    }
  }
}
