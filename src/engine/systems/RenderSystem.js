import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Health } from '../components/Health.js';

export class RenderSystem {
  update() {
    const ctx = this.game.ctx;
    const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Position));
    if (player) {
      const pp = player.get(Position);
      this.game.camera = { x: pp.x - ctx.canvas.width / 2, y: pp.y - ctx.canvas.height / 2 };
    }
    const cam = this.game.camera || { x: 0, y: 0 };
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const entity of this.game.entities) {
      if (entity.has(Position) && entity.has(Sprite)) {
        const p = entity.get(Position);
        const s = entity.get(Sprite);
        const x = p.x - cam.x;
        const y = p.y - cam.y;
        if (s.emoji) {
          ctx.font = `${s.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.emoji, x, y);
        } else {
          ctx.fillStyle = s.color;
          ctx.fillRect(x - s.size / 2, y - s.size / 2, s.size, s.size);
        }
        if (entity.has(PlayerControlled) && entity.has(Health)) {
          const h = entity.get(Health);
          const barWidth = 40;
          const barHeight = 5;
          const bx = x - barWidth / 2;
          const by = y - s.size / 2 - 10;
          ctx.fillStyle = 'red';
          ctx.fillRect(bx, by, barWidth, barHeight);
          ctx.fillStyle = 'green';
          ctx.fillRect(bx, by, barWidth * (h.current / h.max), barHeight);
        }
      }
    }
  }
}
