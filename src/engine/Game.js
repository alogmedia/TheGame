export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.entities = new Set();
    this.systems = [];
    this.lastTime = 0;
    this.running = false;
    this.elapsed = 0;
  }
  addEntity(entity) {
    this.entities.add(entity);
  }
  removeEntity(entity) {
    this.entities.delete(entity);
  }
  addSystem(system) {
    system.game = this;
    this.systems.push(system);
  }
  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
  loop(time) {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.elapsed += dt;
    for (const system of this.systems) {
      system.update(dt);
    }
    requestAnimationFrame(this.loop.bind(this));
  }
}
