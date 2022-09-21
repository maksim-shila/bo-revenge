import { RectHitbox } from "../../core/hitbox.js";
import Game from "../../game.js";
import { Spawner } from "../enemy-spawner.js";
import { Enemy } from "../enemy.js";

export default class SpiderSpawner implements Spawner {
    private readonly game: Game;
    private spawnFrames = 200;
    private nextSpawnFrame = this.spawnFrames;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.game.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 500 + 0;
            this.nextSpawnFrame = this.game.totalFrames + this.spawnFrames + salt;
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Spider(this.game);
    }
}

class Spider extends Enemy {
    constructor(game: Game) {
        super(game, { imageId: "enemySpiderBigImg", width: 120, height: 144 });
        this.hitbox = new RectHitbox({
            parent: this.rect,
            xCounter: (parent): number => parent.x + 30,
            yCounter: (parent): number => parent.y + 30,
            width: this.width - 60,
            height: this.height - 60
        });
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