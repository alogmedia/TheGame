import { Entity } from '../Entity.js';
import { Enemy } from '../components/Enemy.js';
import { Position } from '../components/Position.js';
import { Velocity } from '../components/Velocity.js';
import { Sprite } from '../components/Sprite.js';
import { Health } from '../components/Health.js';
import { PlayerControlled } from '../components/PlayerControlled.js';

export class StageSystem {
  constructor(duration = 900) {
    this.duration = duration;
    this.nextReaper = duration;
    this.cleared = false;
  }

  setDuration(seconds) {
    this.duration = seconds;
    this.nextReaper = seconds;
    this.cleared = false;
    if (this.game) {
      this.game.stageDuration = seconds;
      this.game.timeRemaining = seconds;
    }
  }

  update() {
    if (this.game) {
      this.game.timeRemaining = Math.max(0, this.duration - this.game.elapsed);
      if (this.game.stageDuration === undefined) {
        this.game.stageDuration = this.duration;
      }
    }
    if (this.game.elapsed >= this.nextReaper) {
      if (!this.cleared) {
        for (const e of Array.from(this.game.entities)) {
          if (e.has(Enemy)) this.game.removeEntity(e);
        }
        if (this.game.onStageComplete) this.game.onStageComplete();
        this.cleared = true;
      }
      this.spawnReaper();
      this.nextReaper += 60;
    }
  }

  spawnReaper() {
    const canvas = this.game.ctx.canvas;
    const cam = this.game.camera || { x: 0, y: 0 };
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { // top
      x = cam.x + Math.random() * canvas.width;
      y = cam.y - 40;
    } else if (side === 1) { // bottom
      x = cam.x + Math.random() * canvas.width;
      y = cam.y + canvas.height + 40;
    } else if (side === 2) { // left
      x = cam.x - 40;
      y = cam.y + Math.random() * canvas.height;
    } else { // right
      x = cam.x + canvas.width + 40;
      y = cam.y + Math.random() * canvas.height;
    }
    const player = [...this.game.entities].find(e => e.has(PlayerControlled) && e.has(Position));
    if (!player) return;
    const pp = player.get(Position);
    const dx = pp.x - x;
    const dy = pp.y - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 60;
    const reaper = new Entity()
      .add(new Position(x, y))
      .add(new Velocity((dx / dist) * speed, (dy / dist) * speed))
      .add(new Sprite(40, null, '☠️'))
      .add(new Enemy(40, true))
      .add(new Health(100));
    this.game.addEntity(reaper);
  }
}

