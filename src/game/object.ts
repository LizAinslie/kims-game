import { AABB, uuidv4 } from './util';

export default abstract class GameObject {
  x = 0;
  y = 0;

  width = 0;
  height = 0;

  movementX = 0;
  movementY = 0;

  dragging = false;

  id = uuidv4();

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  update() {
    // move based on the movement "vector". we're just dragging with the mouse so this isnt anything special hence the quotations
    this.x += this.movementX; // speed * Delta.deltaTime;
    this.y += this.movementY; // speed * Delta.deltaTime;

    this.movementX = 0;
    this.movementY = 0;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;

  // simple flexible AABB collision detection
  collide(x1: number, y1: number, x2 = x1, y2 = y1): boolean {
    return (
      x1 <= this.x + this.width &&
      x2 >= this.x &&
      y1 <= this.y + this.height &&
      y2 >= this.y
    );
  }

  setDragging(dragging: boolean) {
    this.dragging = dragging;
  }

  move(x: number, y: number) {
    this.movementX = x;
    this.movementY = y;
  }

  getReceptacleBounds(): AABB & { id: string } {
    // find the center point
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    // and double the size while keeping it centered. todo: add difficulty setting?
    return {
      x1: cx - this.width,
      y1: cy - this.height,
      x2: cx + this.width,
      y2: cy + this.height,
      id: this.id,
    };
  }
}

export class TestObject extends GameObject {
  width = 50;
  height = 50;

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.dragging ? '#10b981' : '#ef4444';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
