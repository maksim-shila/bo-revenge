import { FrameTimer } from "../../utils/frame-timer.js";
import { Hitbox, RectHitbox } from "../core/hitbox.js";
import Sprite, { SpriteConfig } from "../core/sprite.js";
import Game from "../game.js";

export abstract class Enemy extends Sprite {
    public markedForDeletion: boolean;
    public hitbox: Hitbox;

    constructor(game: Game, config: SpriteConfig) {
        super(game, config);
        this.hitbox = new RectHitbox({ parent: this.rect });
        this.fps = 20;
        this.markedForDeletion = false;
    }

    public update(frameTimer: FrameTimer): void {
        this.animate(frameTimer);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.config.debug) {
            this.hitbox.draw(context);
        }
    }
}