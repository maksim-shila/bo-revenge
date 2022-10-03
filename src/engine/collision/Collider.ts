import { GameObject } from "..";

export interface Collider {
    x: number;
    y: number;
    width: number;
    height: number;
    hasCollision(other: Collider): boolean;
    draw(context: CanvasRenderingContext2D): void;
}

export class RectCollider implements Collider {
    constructor(
        private parent: GameObject,
        private computeX: (parent: GameObject) => number = p => p.x,
        private computeY: (parent: GameObject) => number = p => p.y,
        private computeWidth: (parent: GameObject) => number = p => p.width,
        private computeHeight: (parent: GameObject) => number = p => p.height
    ) { }

    public get x(): number {
        return this.computeX(this.parent);
    }

    public get y(): number {
        return this.computeY(this.parent);
    }

    public get width(): number {
        return this.computeWidth(this.parent);
    }

    public get height(): number {
        return this.computeHeight(this.parent);
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.lineWidth = 3;
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    public hasCollision(other: Collider): boolean {
        return other.x < this.x + this.width &&
            other.x + other.width > this.x &&
            other.y < this.y + this.height &&
            other.y + other.height > this.y;
    }
}

export class BlankCollider {
    public readonly x = 0;
    public readonly y = 0;
    public readonly width = 0;
    public readonly height = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasCollision(other: Collider): boolean {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(context: CanvasRenderingContext2D): void {
    }
}