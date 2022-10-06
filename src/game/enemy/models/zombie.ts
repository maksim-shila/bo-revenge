import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { AnimationRow, Animator, Collision, FrameTimer, RectCollider, RigidBody } from "../../../engine";

export default class ZombieSpawner implements Spawner {
    private readonly game: Game;
    private nextSpawnFrame = 2000;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.game.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const spawnFrames = Math.random() * 3000 + 1000;
            this.nextSpawnFrame = this.game.totalFrames + spawnFrames;
        } else {
            this.nextSpawnFrame -= Math.random() * 1 + 1; // Affected by zombie speed
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Zombie(this.game);
    }
}

const Source = { imageId: "zombieGreenImg", width: 562, height: 502 };

class Zombie extends Enemy {
    constructor(game: Game) {
        const scale = 0.2;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super(game, width, height);
        this.name = "zombie";
        this.type = "zombie"; // just to avoid player collisions, zombie is immortal

        this.animator = new Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 30;
        this.animator.animation = new AnimationRow(0, 10);
        this.rigidBody = new RigidBody(1);
        this.collider = new RectCollider(this, 10, 0, -20, 0);

        this.x = this.game.width + 200; // move spawn offscreen to have time until plant falls
        this.y = this.game.height - this.height - 200;
        this.vx = Math.random() * 1 + 1;
        this.vy = 0;
    }

    public override update(frameTimer: FrameTimer): void {
        if (!this.onGround) {
            this.vy += this.weight;
        }
        super.update(frameTimer);
    }

    public override onCollisionEnter(collision: Collision) {
        if (collision.other(this).type === "obstacle" && collision.direction === "left") {
            this.jump();
        }
    }

    private jump(): void {
        if (this.onGround) {
            this.y -= 1;
            this.vy = -30;
        }
    }
}