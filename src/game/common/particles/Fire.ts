import { Scene } from "../../../engine";
import Particle from "./Particle";

export default class Fire extends Particle {
    private readonly image: CanvasImageSource;
    private angle: number;
    private va: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene);
        this.image = document.getElementById("fireImg") as CanvasImageSource;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 100 + 50;
        this.vx = 1;
        this.vy = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }

    public override update(): void {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.drawX, this.drawY);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}