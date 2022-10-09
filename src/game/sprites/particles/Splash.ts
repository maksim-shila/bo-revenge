import { Scene } from "../../../engine";
import Particle from "./Particle";

export default class Splash extends Particle {
    private readonly image: CanvasImageSource;
    private gravity: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene);
        this.image = document.getElementById("fireImg") as CanvasImageSource;
        this.size = Math.random() * 100 + 100;
        this.x = x - this.size * 0.4;
        this.y = y - this.size * 0.5;
        this.vx = Math.random() * 6 - 4;
        this.vy = Math.random() * 2 + 1;
        this.gravity = 0;
    }

    public override update(): void {
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}