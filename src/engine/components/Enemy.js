export class Enemy {
  constructor(damage = 10, persistent = false) {
    this.tag = 'enemy';
    this.damage = damage;
    this.persistent = persistent;
  }
}
