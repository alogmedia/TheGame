export class Input {
  constructor(canvas) {
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  isDown() {
    return false;
  }
}
