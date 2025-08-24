import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/engine/Game.js';
import { Entity } from '../src/engine/Entity.js';
import { Position } from '../src/engine/components/Position.js';
import { Sprite } from '../src/engine/components/Sprite.js';
import { Experience } from '../src/engine/components/Experience.js';
import { PlayerControlled } from '../src/engine/components/PlayerControlled.js';
import { XPGem } from '../src/engine/components/XPGem.js';
import { PickupSystem } from '../src/engine/systems/PickupSystem.js';

const mockCtx = {
  canvas: { width: 800, height: 600 },
  clearRect() {},
  fillRect() {}
};

test('Player collects XP gem and levels up', () => {
  const game = new Game(mockCtx);
  const pickup = new PickupSystem();
  game.addSystem(pickup);
  const player = new Entity()
    .add(new Position(0, 0))
    .add(new Sprite(20))
    .add(new Experience(1, 4, 5))
    .add(new PlayerControlled());
  const gem = new Entity()
    .add(new Position(5, 0))
    .add(new Sprite(5))
    .add(new XPGem(1));
  game.addEntity(player);
  game.addEntity(gem);
  pickup.update();
  const exp = player.get(Experience);
  assert.equal(exp.level, 2);
  assert.equal(exp.xp, 0);
  assert.ok(!game.entities.has(gem));
});
