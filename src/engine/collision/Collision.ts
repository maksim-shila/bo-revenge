import { GameObject } from "..";

export class Collision {
    constructor(
        public readonly left: GameObject,
        public readonly right: GameObject,
    ) { }

    public other(self: GameObject): GameObject {
        return this.left === self ? this.right : this.left;
    }

    public get direction(): "left" | "right" | "top" | "bottom" {
        const isLeft = this.right.x < this.left.x;
        const isTop = this.right.y < this.left.y;
        const collisionWidth = isLeft ? this.right.rx - this.left.x : this.left.rx - this.right.x;
        const collisionHeight = isTop ? this.right.ry - this.left.y : this.left.ry - this.right.y;
        if (collisionWidth <= Math.abs(this.left.vx - this.right.vx)) {
            return isLeft ? "left" : "right";
        }
        if (collisionHeight <= Math.abs(this.left.vy - this.right.vy)) {
            return isTop ? "top" : "bottom";
        }

        // Default value could be updated so don't merge it with condition
        return isTop ? "top" : "bottom";
    }

    public equals(other: Collision): boolean {
        return this.containsBoth(other.left, other.right);
    }

    public containsBoth(left: GameObject, right: GameObject) {
        return this.left === left && this.right === right;
    }
}