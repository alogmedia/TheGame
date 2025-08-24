export class PlayerControlled {
  constructor(speed = 200, fireRate = 5) {
    this.speed = speed;
    this.fireRate = fireRate; // bullets per second
    this.cooldown = 0;
  }
}
