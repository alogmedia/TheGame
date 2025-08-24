export class Input {
  constructor() {
    this.keys = new Set();
    window.addEventListener('keydown', e => this.keys.add(e.key.toLowerCase()));
    window.addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
  }
  isDown(key) {
    return this.keys.has(key.toLowerCase());
  }
}
