import { AnimationRow, Animator, FrameTimer } from "../engine";
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

const Source = { imageId: "boomImg", width: 100, height: 90 };

class CollisionAnimation extends Sprite {
    public markedForDeletion: boolean;

    constructor(game: Game, x: number, y: number) {
        const scale = Math.random() + 0.5;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super("particle", game, width, height);
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;

        this.animator = new Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 15;
        this.animator.animation = new AnimationRow(0, 5);

        this.markedForDeletion = false;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.x -= this.game.speed;
        if (this.animator?.animation?.isMaxFrame) {
            this.markedForDeletion = true;
        }
    }
}