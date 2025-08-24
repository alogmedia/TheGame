import test from 'node:test';
import assert from 'node:assert/strict';
import { Entity } from '../src/engine/Entity.js';
import { Position } from '../src/engine/components/Position.js';

test('Entity stores and retrieves components', () => {
  const e = new Entity().add(new Position(1, 2));
  assert.ok(e.has(Position));
  const p = e.get(Position);
  assert.equal(p.x, 1);
  assert.equal(p.y, 2);
});
