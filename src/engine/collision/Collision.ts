import { Collider, GameObject } from "..";

export type CollisionDirection = "left" | "right" | "top" | "bottom";

export class Collision {

    private _direction: CollisionDirection;

    constructor(
        public readonly left: Collider,
        public readonly right: Collider,
    ) {
        this._direction = this.computeDirection();
    }

    public other(self: GameObject): GameObject {
        return this.left.parent === self ? this.right.parent : this.left.parent;
    }

    public get direction(): CollisionDirection {
        return this._direction;
    }

    public computeDirection(): CollisionDirection {
        const isLeft = this.right.x < this.left.x;
        const isTop = this.right.y < this.left.y;
        const collisionWidth = Math.floor(isLeft ? this.right.rx - this.left.x : this.left.rx - this.right.x);
        const collisionHeight = Math.floor(isTop ? this.right.ry - this.left.y : this.left.ry - this.right.y);
        if (collisionHeight <= Math.abs(this.left.parent.vy - this.right.parent.vy)) {
            return isTop ? "top" : "bottom";
        }
        if (collisionWidth <= Math.abs(this.left.parent.vx - this.right.parent.vx)) {
            return isLeft ? "left" : "right";
        }

        return "right";
    }

    public equals(other: Collision): boolean {
        return this.containsBoth(other.left, other.right);
    }

    public containsBoth(left: Collider, right: Collider) {
        return this.left === left && this.right === right;
    }
}