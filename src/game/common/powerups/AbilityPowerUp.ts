import * as Bad from "bad-engine";
import { RectCollider } from "bad-engine";
import Player from "../Player";

const Source = {
    width: 500,
    height: 500,
    scale: 0.35
};

export default class AbilityPowerUp extends Bad.GameObject {
    private readonly moveDimension = 200;
    private readonly minY: number;
    private readonly maxY: number;
    private readonly pickupAudio: HTMLAudioElement;

    constructor(scene: Bad.Scene, x: number, y: number) {
        const width = Math.floor(Source.width * Source.scale);
        const height = Math.floor(Source.height * Source.scale);

        super("powerup", scene, width, height);
        this.x = x;
        this.y = y;
        this.minY = this.cy - this.moveDimension * 0.5;
        this.maxY = this.cy + this.moveDimension * 0.5;
        this.vy = 1;
        this.animator = new Bad.Animator("powerupImg", width, height, Source.width, Source.height);
        this.collider = new RectCollider(this, 50, 50, -100, -100);
        this.pickupAudio = document.getElementById("pickupAudio") as HTMLAudioElement;
    }

    public override update(frame: Bad.Frame) {
        super.update(frame);
        this.y += this.vy;
        if (this.y < this.minY || this.ry > this.maxY) {
            this.vy *= -1;
        }
    }

    public override onCollisionEnter(collision: Bad.Collision): void {
        const other = collision.other(this);
        if (other.type === "player") {
            this.pickupAudio.play();
            this.apply(other as Player);
            this.destroy();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public apply(player: Player) {
    }
}