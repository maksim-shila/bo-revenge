import GameObject from "./GameObject";

export default class Collider {

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

    public draw(context: CanvasRenderingContext2D) {
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