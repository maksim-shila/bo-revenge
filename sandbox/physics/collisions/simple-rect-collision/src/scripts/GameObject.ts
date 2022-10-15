import Collider from "./Collider";

export default class GameObject {

    public vx = 0;
    public vy = 0;
    public collider: Collider | null = null;

    constructor(
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0
    ) { }

    public get rx(): number {
        return this.x + this.width;
    }

    public get ry(): number {
        return this.y + this.height;
    }

    public onCollisionEnter(other: GameObject) {
    }
}