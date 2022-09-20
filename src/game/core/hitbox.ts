type RectParams = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor({ x, y, width, height }: RectParams) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

type PositionCounter = (rect: Rect) => number;
type HitboxParams = {
    parent: Rect;
    xCounter?: PositionCounter;
    yCounter?: PositionCounter;
    width?: number;
    height?: number;
}

export interface Hitbox {
    x: number;
    y: number;
    rx: number;
    ry: number;
    width: number;
    height: number;
    hasCollision(other: Hitbox): boolean;
    draw(context: CanvasRenderingContext2D): void
}

export class RectHitbox implements Hitbox {

    private readonly parent: Rect;
    private readonly xCounter: PositionCounter;
    private readonly yCounter: PositionCounter;

    public readonly width: number;
    public readonly height: number;

    constructor(params: HitboxParams) {
        this.parent = params.parent;
        this.xCounter = params.xCounter ?? ((rect): number => rect.x);
        this.yCounter = params.yCounter ?? ((rect): number => rect.y);
        this.width = params.width ?? this.parent.width;
        this.height = params.height ?? this.parent.height;
    }

    public get x(): number {
        return this.xCounter(this.parent);
    }

    public get y(): number {
        return this.yCounter(this.parent);
    }

    public get rx(): number {
        return this.x + this.width;
    }

    public get ry(): number {
        return this.y + this.height;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.restore();
    }

    public hasCollision(other: Hitbox): boolean {
        return other.x < this.x + this.width &&
            other.x + other.width > this.x &&
            other.y < this.y + this.height &&
            other.y + other.height > this.y;
    }
}

export class NoHitbox implements Hitbox {
    public readonly x = 0;
    public readonly y = 0;
    public readonly rx = 0;
    public readonly ry = 0;
    public readonly width = 0;
    public readonly height = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasCollision(other: Hitbox): boolean {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(context: CanvasRenderingContext2D): void {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collisionDirection(other: Hitbox): "left" | "top" | "right" | "bottom" | "none" {
        return "none";
    }
}