import { GameObject, Scene } from "../../../engine";

export default abstract class Particle extends GameObject {

    protected size = 1;

    constructor(scene: Scene) {
        super("particle", scene);
    }

    public override update(): void {
        this.x -= this.vx - this.scene.vx;
        this.y -= this.vy;
        this.size *= 0.9;
        if (this.size < 0.5) {
            this.destroy();
        }
    }
}