export class PlayerControlled {
  constructor(speed = 200, fireRate = 5) {
    this.speed = speed;
    this.fireRate = fireRate; // bullets per second
    this.cooldown = 0;
    this.bulletSpeed = 400;
    this.bulletSize = 4;
    this.bulletDamage = 1;
    this.shotCount = 1;
  }
}
