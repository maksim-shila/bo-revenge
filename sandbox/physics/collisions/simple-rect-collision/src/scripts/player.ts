import Collider from "./Collider";
import GameObject from "./GameObject";
import Input from "./input";

export default class Player extends GameObject {

    private readonly color = "black";
    private readonly speed = 10;

    constructor(private window: { width: number, height: number }) {
        super(50, 50, 50, 50);
        this.collider = new Collider(this);
    }

    public update(input: Input) {
        if (input.keyPressed("KeyD")) {
            this.vy = 0;
            this.vx = this.speed;
        } else if (input.keyPressed("KeyA")) {
            this.vy = 0;
            this.vx = -this.speed;
        } else {
            this.vx = 0;
        }

        if (input.keyPressed("KeyW")) {
            this.vx = 0;
            this.vy = -this.speed;
        } else if (input.keyPressed("KeyS")) {
            this.vx = 0;
            this.vy = this.speed;
        } else {
            this.vy = 0;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > this.window.width - this.width) {
            this.x = this.window.width - this.width;
        } else if (this.x < 0) {
            this.x = 0;
        }

        if (this.y > this.window.height - this.height) {
            this.y = this.window.height - this.height;
        } else if (this.y < 0) {
            this.y = 0;
        }
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        this.collider?.draw(context);
    }

    public override onCollisionEnter(other: GameObject): void {
        const isLeft = other.x < this.x;
        const isTop = other.y < this.y;
        const collisionWidth = isLeft ? other.rx - this.x : this.rx - other.x;
        const collisionHeight = isTop ? other.ry - this.y : this.ry - other.y;
        if (collisionWidth <= Math.abs(this.vx - other.vx)) {
            this.x = isLeft ? other.rx : other.x - this.width;
        } else if (collisionHeight <= Math.abs(this.vy - other.vy)) {
            this.y = isTop ? other.ry : other.y - this.height;
        }
    }
}