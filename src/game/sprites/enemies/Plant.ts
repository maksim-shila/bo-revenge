import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";
import { AnimationRow, Animator, FrameTimer, RectCollider, RigidBody, Scene } from "../../../engine";

export default class PlantSpawner implements Spawner {
    private spawnFrames = 300;
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
        return new Plant(this.scene);
    }
}

const Source = { imageId: "enemyPlantImg", width: 60, height: 87 };

class Plant extends Enemy {
    constructor(scene: Scene) {
        super(scene, Source.width, Source.height);
        this.name = "plant";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 2);
        this.rigidBody = new RigidBody(2);
        this.collider = new RectCollider(this);

        this.x = this.scene.width + 200; // move spawn offscreen to have time until plant falls
        this.y = this.scene.height - this.height - 100;
        this.vx = 0;
        this.vy = 0;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (!this.onGround) {
            this.vy += this.weight;
        }
        this.x += this.scene.vx;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.destroy();
        }
    }
}