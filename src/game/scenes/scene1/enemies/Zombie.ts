import * as Bad from "bad-engine";
import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";

export default class ZombieSpawner implements Spawner {
    private readonly spawnDistance = 2000;
    private nextSpawnTriggerX = this.spawnDistance;

    constructor(private readonly scene: Bad.Scene) { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.scene.camera.x >= this.nextSpawnTriggerX;
        if (shouldSpawn) {
            this.nextSpawnTriggerX = this.scene.camera.x + this.spawnDistance + Math.random() * 3000 + 1000;
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Zombie(this.scene);
    }
}

const Source = { imageId: "zombieGreenImg", width: 562, height: 502 };

class Zombie extends Enemy {
    constructor(scene: Bad.Scene) {
        const scale = 0.2;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super(scene, width, height);
        this.name = "zombie";

        this.animator = new Bad.Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 30;
        this.animator.animation = new Bad.AnimationRow(0, 10);
        this.rigidBody = new Bad.RigidBody(0.8);
        this.collider = new Bad.RectCollider(this, 10, 0, -20, 0);

        this.x = this.scene.camera.rx + 200; // move spawn offscreen to have time until plant falls
        this.y = this.scene.height - this.height - 90;
        this.vx = -(Math.random() * 1 + 1);
        this.vy = 0;
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        if (!this.onGround) {
            this.vy += this.weight;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.isOffscreen(["left", "bottom"])) {
            this.destroy();
        }
    }

    public override onObstacleCollisions(directions: Bad.CollisionDirection[]) {
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