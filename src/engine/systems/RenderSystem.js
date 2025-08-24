import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';

export class RenderSystem {
  update() {
    const ctx = this.game.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const entity of this.game.entities) {
      if (entity.has(Position) && entity.has(Sprite)) {
        const p = entity.get(Position);
        const s = entity.get(Sprite);
        ctx.fillStyle = s.color;
        ctx.fillRect(p.x - s.size / 2, p.y - s.size / 2, s.size, s.size);
      }
    }
  }
}
