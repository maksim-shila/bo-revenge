import Collision from "./collision.js";
import ScreenObject from "./screen-object.js";

export default interface Hitbox {
    outOfX(hitbox: Hitbox): boolean;
    x: number;
    y: number;
    rx: number;
    ry: number;
    draw(context: CanvasRenderingContext2D): void;
    collisionX(other: Hitbox): Collision | null;
    collisionY(other: Hitbox): Collision | null;
}

export class RectHitbox implements Hitbox {

    private readonly _parent: ScreenObject;
    private _width: number;
    private _height: number;

    constructor(parent: ScreenObject) {
        this._parent = parent;
        this._width = parent.width;
        this._height = parent.height;
    }

    public get x(): number {
        return this._parent.x;
    }

    public get y(): number {
        return this._parent.y;
    }

    public get rx(): number {
        return this._parent.rx;
    }

    public get ry(): number {
        return this._parent.ry;
    }

    public collisionX(other: Hitbox): Collision | null {
        if (this.ry <= other.y) {
            return null;
        }
        if (this.rx > other.x && this.x < other.rx) {
            if (this.rx > other.rx) {
                return new Collision("right", other);
            } else {
                return new Collision("left", other);
            }
        }
        return null;
    }

    public collisionY(other: Hitbox): Collision | null {
        if (this.rx <= other.x || this.x >= other.rx) {
            return null;
        }
        if (this.ry >= other.y) {
            return new Collision("top", other);
        }
        if (this.y >= other.ry) {
            return new Collision("bottom", other);
        }
        return null;
    }

    outOfX(other: Hitbox): boolean {
        return this.rx <= other.x || this.x >= other.rx;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.lineWidth = 4;
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this._width, this._height);
        context.restore();
    }
}

export class NoHitbox implements Hitbox {
    x = 0;
    y = 0;
    rx = 0;
    ry = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    outOfX(hitbox: Hitbox): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(context: CanvasRenderingContext2D): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collisionX(other: Hitbox): Collision | null {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collisionY(other: Hitbox): Collision | null {
        return null;
    }
}