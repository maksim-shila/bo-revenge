import GameObject from "../game-object/GameObject";

export default class Collision {
    constructor(
        public readonly left: GameObject,
        public readonly right: GameObject,
    ) { }

    public other(self: GameObject): GameObject {
        return this.left === self ? this.right : this.left;
    }
}