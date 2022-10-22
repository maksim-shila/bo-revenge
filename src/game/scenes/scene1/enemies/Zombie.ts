import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";
import { AnimationRow, Animator, CollisionDirection, FrameTimer, RectCollider, RigidBody, Scene } from "../../../../engine";

export default class ZombieSpawner implements Spawner {
    private nextSpawnFrame = 2000;
    private totalFrames = 0;

    constructor(private readonly scene: Scene) { }

    public update(): void {
        this.totalFrames += -this.scene.vx;
    }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const spawnFrames = Math.random() * 3000 + 1000;
            this.nextSpawnFrame = this.totalFrames + spawnFrames;
        } else {
            this.nextSpawnFrame -= Math.random() * 1 + 1; // Affected by zombie speed
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Zombie(this.scene);
    }
}

const Source = { imageId: "zombieGreenImg", width: 562, height: 502 };

class Zombie extends Enemy {
    constructor(scene: Scene) {
        const scale = 0.2;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super(scene, width, height);
        this.name = "zombie";

        this.animator = new Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 30;
        this.animator.animation = new AnimationRow(0, 10);
        this.rigidBody = new RigidBody(0.8);
        this.collider = new RectCollider(this, 10, 0, -20, 0);

        this.x = this.scene.width + 200; // move spawn offscreen to have time until plant falls
        this.y = this.scene.height - this.height - 90;
        this.vx = -(Math.random() * 1 + 1);
        this.vy = 0;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (!this.onGround) {
            this.vy += this.weight;
        }
        this.x += this.vx + this.scene.vx;
        this.y += this.vy;

        if (this.isOffscreen(["left", "bottom"])) {
            this.destroy();
        }
    }

    public override onObstacleCollisions(directions: CollisionDirection[]) {
        if (directions.includes("left")) {
            this.jump();
        }
    }

    private jump(): void {
        if (this.onGround) {
            this.vy = -20;
        }
    }
}