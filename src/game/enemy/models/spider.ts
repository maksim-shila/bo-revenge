import { AnimationRow, Animator, FrameTimer, RigidBody } from "../../../engine";
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

const Source = { imageId: "enemySpiderBigImg", width: 120, height: 144 };

class Spider extends Enemy {

    private readonly maxVY: number;

    constructor(game: Game) {
        super(game, Source.width, Source.height);
        this.name = "spider";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 6);
        this.rigidBody = new RigidBody();
        this.collider = new RectCollider(this);

        this.x = this.game.width + 50;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = 0;
        this.maxVY = Math.random() > 0.5 ? 1 : -1;
        this.vy = this.maxVY;
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
        this.drawWeb(context);
        super.draw(context);
    }

    private drawWeb(context: CanvasRenderingContext2D): void {
        context.save();
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.moveTo(this.x + this.width * 0.5, 0);
        context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
        context.stroke();
        context.restore();
    }
}