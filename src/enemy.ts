import { Hitbox, RectHitbox } from "./core/hitbox.js";
import Sprite, { SpriteConfig } from "./core/sprite.js";
import Game from "./game.js";

const flyingEnemyConfig: SpriteConfig = {
    imageId: "enemyFlyImg",
    width: 60,
    height: 44
};
const groundEnemyConfig: SpriteConfig = {
    imageId: "enemyPlantImg",
    width: 60,
    height: 87
};
const climbingEnemyConfig: SpriteConfig = {
    imageId: "enemySpiderBigImg",
    width: 120,
    height: 144
};

export default abstract class Enemy extends Sprite {
    public markedForDeletion: boolean;
    public readonly hitbox: Hitbox;
    constructor(game: Game, config: SpriteConfig) {
        super(game, config);
        this.hitbox = new RectHitbox({ parent: this.rect });
        this.fps = 20;
        this.markedForDeletion = false;
    }

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.debug) {
            this.hitbox.draw(context);
        }
    }
}

export class FlyingEnemy extends Enemy {
    private angle: number;
    private va: number;

    constructor(game: Game) {
        super(game, flyingEnemyConfig);
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.framesCount = 6;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game: Game) {
        super(game, groundEnemyConfig);
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vx = 0;
        this.vy = 0;
        this.framesCount = 2;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game: Game) {
        super(game, climbingEnemyConfig);
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = 0;
        this.vy = Math.random() > 0.5 ? 1 : -1;
        this.framesCount = 6;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        if (this.isTouching("bottom")) {
            this.vy *= -1;
        }
        if (this.isOffscreen("top")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(this.x + this.width * 0.5, 0);
        context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
        context.stroke();
        super.draw(context);
    }
}