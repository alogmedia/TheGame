import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/engine/Game.js';
import { Entity } from '../src/engine/Entity.js';
import { Position } from '../src/engine/components/Position.js';
import { Velocity } from '../src/engine/components/Velocity.js';
import { MovementSystem } from '../src/engine/systems/MovementSystem.js';

const mockCtx = {
  canvas: { width: 800, height: 600 },
  clearRect() {},
  fillRect() {}
};

test('MovementSystem updates position', () => {
  const game = new Game(mockCtx);
  const move = new MovementSystem();
  game.addSystem(move);
  const entity = new Entity().add(new Position(0, 0)).add(new Velocity(10, 0));
  game.addEntity(entity);
  move.update.call({ game }, 1); // invoke with game context
  assert.equal(entity.get(Position).x, 10);
});
