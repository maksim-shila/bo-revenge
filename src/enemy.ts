import Sprite, { SpriteConfig } from "./core/sprite.js";
import Game from "./game.js";

const flyingEnemyConfig: SpriteConfig = {
    imageId: "enemyFlyImg",
    width: 60,
    height: 44
};
const groundEnemyConfig: SpriteConfig = {
    imageId: "enemyPlantImg",
    width: 1,
    height: 1
};
const climbingEnemyConfig: SpriteConfig = {
    imageId: "enemySpiderBigImg",
    width: 1,
    height: 1
};

export default abstract class Enemy extends Sprite {
    public markedForDeletion: boolean;

    constructor(game: Game, config: SpriteConfig) {
        super(game, config);
        this.fps = 20;
        this.markedForDeletion = false;
    }

    public abstract update(deltaTime: number): void;
}

export class FlyingEnemy extends Enemy {
    constructor(game: Game) {
        super(game, flyingEnemyConfig);
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.framesCount = 6;
    }

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.markedForDeletion = true;
        }
    }
}

export class GroundEnemy extends Enemy {
    constructor(game: Game) {
        super(game, groundEnemyConfig);
    }

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x += this.vx;
        this.y += this.vy;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game: Game) {
        super(game, climbingEnemyConfig);
    }

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x += this.vx;
        this.y += this.vy;
    }
}