import { AnimationRow, Animator, FrameTimer, Hitbox, RigidBody, Scene } from "../../../engine";
import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";
import { RectCollider } from "../../../engine/collision/Collider";

export default class SpiderSpawner implements Spawner {
    private spawnFrames = 200;
    private nextSpawnFrame = this.spawnFrames;
    private totalFrames = 0;

    constructor(private readonly scene: Scene) { }

    public update(): void {
        this.totalFrames += -this.scene.vx;
    }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 500 + 0;
            this.nextSpawnFrame = this.totalFrames + this.spawnFrames + salt;
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Spider(this.scene);
    }
}

const Source = { imageId: "enemySpiderBigImg", width: 120, height: 144 };

class Spider extends Enemy {

    private readonly maxVY: number;

    constructor(scene: Scene) {
        super(scene, Source.width, Source.height);
        this.name = "spider";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 6);
        this.rigidBody = new RigidBody();
        this.collider = new RectCollider(this);
        this.hitbox = new Hitbox();
        this.hitbox.add(new RectCollider(this, 30, 30, -60, -60));

        this.x = this.scene.width + 200;
        this.y = Math.random() * this.scene.height * 0.5;
        this.vx = 0;
        this.maxVY = Math.random() > 0.5 ? 1 : -1;
        this.vy = this.maxVY;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (this.onGround) {
            this.vy = -Math.abs(this.maxVY);
        }
        this.x += this.scene.vx;
        this.y += this.vy;
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