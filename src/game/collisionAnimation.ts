import { FrameTimer } from "../utils/frame-timer";
import Sprite from "./core/sprite";
import Game from "./game";

export default class CollisionAnimationFactory {

    private readonly game: Game;
    private animations: CollisionAnimation[];

    constructor(game: Game) {
        this.game = game;
        this.animations = [];
    }

    public add(x: number, y: number): void {
        this.animations.push(new CollisionAnimation(this.game, x, y));
    }

    public update(frameTimer: FrameTimer): void {
        this.animations.forEach(animation => animation.update(frameTimer));
        this.animations = this.animations.filter(a => !a.markedForDeletion);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.animations.forEach(animation => animation.draw(context));
    }
}

class CollisionAnimation extends Sprite {
    public markedForDeletion: boolean;

    constructor(game: Game, x: number, y: number) {
        super(game, { imageId: "boomImg", width: 100, height: 90, scale: Math.random() + 0.5 });
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.framesCount = 5;
        this.fps = 15;
        this.markedForDeletion = false;
    }

    public update(frameTimer: FrameTimer): void {
        this.animate(frameTimer);
        this.x -= this.game.speed;
        if (this.isMaxFrame()) {
            this.markedForDeletion = true;
        }
    }
}