import { MutableRefObject } from 'react';
import GameObject, { TestObject } from './object';
import { Delta, getRandomInt } from './util';

export const enum GameStage {
  VIEW,
  GUESS,
}

export default class Game {
  public static BORDER = 16;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private objects: GameObject[] = [];
  public stage: GameStage = GameStage.VIEW;
  public itemCount: number;

  constructor(
    canvasRef: MutableRefObject<HTMLCanvasElement>,
    itemCount: number
  ) {
    this.canvas = canvasRef.current; // init canvas
    // assertion is fine here - this only errors in skill issue browsers and we only use chrome in this household
    this.ctx = this.canvas.getContext('2d')!;

    // game factors
    this.itemCount = itemCount;

    // binds
    this.loop = this.loop.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseup', this.onMouseUp);

    this.resizeCanvas();
    window.onresize = () => this.resizeCanvas();
  }

  _getMousePos(evt: MouseEvent) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  checkForOtherObjects(
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    let collision = false;

    for (const o of this.objects) {
      if (o.collide(x, y, x + width, y + height)) collision = true;
    }

    return collision;
  }

  randomlyPlaceObject(object: GameObject) {
    let x = Game.BORDER,
      y = Game.BORDER;

    // create a random coordinate within bounds of map, respecting a border & avoiding collision w/ other objects.
    do {
      // randomly place it first
      x = getRandomInt(
        Game.BORDER,
        this.canvas.width - Game.BORDER - object.width
      );
      y = getRandomInt(
        Game.BORDER,
        this.canvas.height - Game.BORDER - object.height
      );
    } while (this.checkForOtherObjects(x, y, object.width, object.height)); // does it collide with anything else? if so keep trying

    object.move(x, y);
  }

  start() {
    for (let i = 0; i < this.itemCount; ++i) {
      const object = new TestObject(Game.BORDER, Game.BORDER);
      this.randomlyPlaceObject(object);
      this.objects.push(object);
    }

    requestAnimationFrame(this.loop);
  }

  beginGuessingStage() {
    this.stage = GameStage.GUESS;

    // todo: shuffle all objects
  }

  resizeCanvas() {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  onMouseDown(event: MouseEvent) {
    if (this.stage == GameStage.VIEW) return; // only allow movement in GUESS

    const { x, y } = this._getMousePos(event);
    this.objects.forEach((obj) => {
      if (obj.collide(x, y)) {
        obj.setDragging(true);
      }
    });
  }

  onMouseMove(event: MouseEvent) {
    this.objects.forEach((obj) => {
      if (obj.dragging) {
        obj.move(event.movementX, event.movementY);
      }
    });
  }

  onMouseUp(_event: MouseEvent) {
    this.objects.forEach((obj) => {
      obj.setDragging(false);
    });
  }

  loop(hrt: number) {
    Delta.deltaTime = (hrt - Delta.lastDelta) / 1000;

    this.objects.forEach((obj) => {
      obj.update();
    });
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((sprite) => sprite.draw(this.ctx));

    Delta.lastDelta = hrt;
    requestAnimationFrame(this.loop);
  }
}
