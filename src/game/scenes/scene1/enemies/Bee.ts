import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";
import { AnimationRow, Animator, CollisionDirection, FrameTimer, Hitbox, RectCollider, RigidBody, Scene } from "../../../../engine";

export default class BeeSpawner implements Spawner {
    private readonly spawnFrames = 150;
    private totalFrames = 0;
    private nextSpawnFrame = this.spawnFrames;

    constructor(private readonly scene: Scene) { }

    public update(): void {
        this.totalFrames += -this.scene.vx;
    }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 200 + 100;
            this.nextSpawnFrame = this.totalFrames + this.spawnFrames + salt;
        } else {
            this.nextSpawnFrame -= Math.random() + 1; // Affected by bee speed
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Bee(this.scene);
    }
}

const Source = { imageId: "enemyFlyImg", width: 60, height: 44 };

class Bee extends Enemy {
    private angle: number;
    private va: number;

    constructor(scene: Scene) {
        super(scene, Source.width, Source.height);
        this.name = "bee";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 6);
        this.rigidBody = new RigidBody();
        this.collider = new RectCollider(this);
        this.hitbox = new Hitbox(this);

        this.x = this.scene.width + Math.random() * this.scene.width * 0.5 + 100;
        this.y = Math.random() * this.scene.height * 0.5;
        this.vx = -(Math.random() + 1);
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.angle += this.va;
        this.x += this.vx + this.scene.vx;
        this.y += Math.sin(this.angle) + this.vy;
        if (this.isOffscreen(["left"])) {
            this.destroy();
        }
    }

    public override onObstacleCollisions(directions: CollisionDirection[]) {
        this.vy = directions.includes("left") ? -Math.abs(this.vx) : 0;
    }
}