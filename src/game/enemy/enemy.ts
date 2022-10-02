import { RectCollider } from "../../engine/collision/Collider";
import { FrameTimer } from "../../utils/frame-timer";
import Sprite, { SpriteConfig } from "../core/sprite";
import Game from "../game";

export abstract class Enemy extends Sprite {

    constructor(game: Game, config: SpriteConfig) {
        super("enemy", game, config);
        this.collider = new RectCollider(this);
        this.fps = 20;
    }

    public update(frameTimer: FrameTimer): void {
        this.animate(frameTimer);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.destroy();
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.config.debug) {
            this.collider?.draw(context);
        }
    }
}