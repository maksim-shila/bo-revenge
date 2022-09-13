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

    public draw(context: CanvasRenderingContext2D): void {
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    public hasCollision(other: Hitbox): boolean {
        return other.x < this.x + this.width &&
            other.x + other.width > this.x &&
            other.y < this.y + this.height &&
            other.y + other.height > this.y;
    }
}