import * as Bad from "bad-engine";
import { Spawner } from "./EnemySpawner";
import { Enemy } from "./Enemy";

export default class BeeSpawner implements Spawner {
    private readonly spawnDistance = 50;
    private nextSpawnTriggerX = this.spawnDistance;

    constructor(private readonly scene: Bad.Scene) { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.scene.camera.x >= this.nextSpawnTriggerX;
        if (shouldSpawn) {
            this.nextSpawnTriggerX = this.scene.camera.x + this.spawnDistance + Math.random() * 200 + 100;
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

    constructor(scene: Bad.Scene) {
        super(scene, Source.width, Source.height);
        this.name = "bee";

        this.animator = new Bad.Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new Bad.AnimationRow(0, 6);
        this.rigidBody = new Bad.RigidBody();
        this.collider = new Bad.RectCollider(this);
        this.hitbox = new Bad.Hitbox(this);

        this.x = this.scene.camera.rx + Math.random() * this.scene.camera.rx * 0.5 + 100;
        this.y = Math.random() * this.scene.height * 0.5;
        this.vx = -(Math.random() + 1);
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        this.angle += this.va;
        this.x += this.vx;
        this.y += Math.sin(this.angle) + this.vy;
        if (this.isOffscreen(["left"])) {
            this.destroy();
        }
    }

    public override onObstacleCollisions(directions: Bad.CollisionDirection[]) {
        this.vy = directions.includes("left") ? -Math.abs(this.vx) : 0;
    }
}