import * as Bad from "bad-engine";
import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";

export default class PlantSpawner implements Spawner {

    private readonly spawnDistance = 500;
    private nextSpawnTriggerX = this.spawnDistance;

    constructor(private readonly scene: Bad.Scene) { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.scene.camera.x >= this.nextSpawnTriggerX;
        if (shouldSpawn) {
            this.nextSpawnTriggerX = this.scene.camera.x + this.spawnDistance + Math.random() * 500 + 0;
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Plant(this.scene);
    }
}

const Source = { imageId: "enemyPlantImg", width: 60, height: 87 };

class Plant extends Enemy {
    constructor(scene: Bad.Scene) {
        super(scene, Source.width, Source.height);
        this.name = "plant";

        this.animator = new Bad.Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new Bad.AnimationRow(0, 2);
        this.rigidBody = new Bad.RigidBody(2);
        this.collider = new Bad.RectCollider(this);
        this.hitbox = new Bad.Hitbox(this);

        this.x = this.scene.camera.rx + 200; // move spawn offscreen to have time until plant falls
        this.y = this.scene.height - this.height - 90;
        this.vx = 0;
        this.vy = 0;
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        if (!this.onGround) {
            this.vy += this.weight;
        }
        this.y += this.vy;
        if (this.isOffscreen(["left", "bottom"])) {
            this.destroy();
        }
    }
}