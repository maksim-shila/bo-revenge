import { FrameTimer, RigidBody } from "../../../engine";
import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { RectCollider } from "../../../engine/collision/Collider";

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

    private readonly maxVY: number;

    constructor(game: Game) {
        super(game, { imageId: "enemySpiderBigImg", width: 120, height: 144 });
        this.name = "spider";
        this.collider = new RectCollider(this);
        this.rigidBody = new RigidBody();
        this.x = this.game.width + 50;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = 0;
        this.maxVY = Math.random() > 0.5 ? 1 : -1;
        this.vy = this.maxVY;
        this.framesCount = 6;
    }

    public override update(frameTimer: FrameTimer): void {
        if (this.onGround) {
            this.vy = -this.maxVY;
        }
        super.update(frameTimer);
        if (this.isOffscreen("top")) {
            this.destroy();
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.moveTo(this.x + this.width * 0.5, 0);
        context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
        context.stroke();
        super.draw(context);
    }
}