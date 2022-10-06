import { GameObject } from "..";

export interface Collider {
    parent: GameObject;
    x: number;
    y: number;
    rx: number;
    ry: number;
    width: number;
    height: number;
    hasCollision(other: Collider): boolean;
    draw(context: CanvasRenderingContext2D): void;
}

export class RectCollider implements Collider {
    constructor(
        public readonly parent: GameObject,
        private offsetX = 0,
        private offsetY = 0,
        private offsetWidth = 0,
        private offsetHeight = 0
    ) { }

    public get x(): number {
        return this.parent.x + this.offsetX;
    }

    public set x(value: number) {
        this.parent.x = value - this.offsetX;
    }

    public get y(): number {
        return this.parent.y + this.offsetY;
    }

    public set y(value: number) {
        this.parent.y = value - this.offsetY;
    }

    public get rx(): number {
        return this.x + this.width;
    }

    public get ry(): number {
        return this.y + this.height;
    }

    public get width(): number {
        return this.parent.width + this.offsetWidth;
    }

    public get height(): number {
        return this.parent.height + this.offsetHeight;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.lineWidth = 3;
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.restore();
    }

    public hasCollision(other: Collider): boolean {
        return other.x <= this.rx &&
            other.rx >= this.x &&
            other.y <= this.ry &&
            other.ry >= this.y;
    }
}