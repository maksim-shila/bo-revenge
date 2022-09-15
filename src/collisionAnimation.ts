import Sprite from "./core/sprite.js";
import Game from "./game.js";

export default class CollisionAnimationFactory {

    private readonly game: Game;
    private readonly animations: CollisionAnimation[];

    constructor(game: Game) {
        this.game = game;
        this.animations = [];
    }

    public add(x: number, y: number): void {
        this.animations.push(new CollisionAnimation(this.game, x, y));
    }

    public update(deltaTime: number): void {
        this.animations.forEach(animation => {
            animation.update(deltaTime);
            if (animation.markedForDeletion) {
                this.animations.splice(this.animations.indexOf(animation), 1);
            }
        });
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

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x -= this.game.speed;
        if (this.isMaxFrame()) {
            this.markedForDeletion = true;
        }
    }
}