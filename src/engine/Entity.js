let nextId = 0;
export class Entity {
  constructor() {
    this.id = nextId++;
    this.components = new Map();
  }
  add(component) {
    this.components.set(component.constructor, component);
    return this;
  }
  get(componentClass) {
    return this.components.get(componentClass);
  }
  has(componentClass) {
    return this.components.has(componentClass);
  }
  remove(componentClass) {
    this.components.delete(componentClass);
  }
}
