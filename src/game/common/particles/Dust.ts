import * as Bad from "bad-engine";
import Particle from "./Particle";

export default class Dust extends Particle {

    private readonly color: string;

    constructor(scene: Bad.Scene, x: number, y: number) {
        super(scene);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.vx = Math.random();
        this.vy = Math.random();
        this.color = "rgba(0, 0, 0, 0.2)";
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.drawX, this.drawY, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}