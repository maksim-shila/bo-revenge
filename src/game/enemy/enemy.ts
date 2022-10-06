import { FrameTimer } from "../../engine";
import Sprite from "../core/sprite";
import Game from "../game";

export abstract class Enemy extends Sprite {

    constructor(game: Game, width: number, height: number) {
        super("enemy", game, width, height);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.destroy();
        }
    }
}