import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { AnimationRow, Animator, Collision, FrameTimer, RectCollider, RigidBody } from "../../../engine";

export default class BeeSpawner implements Spawner {
    private readonly game: Game;
    private readonly spawnFrames = 150;
    private nextSpawnFrame = this.spawnFrames;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.game.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 200 + 100;
            this.nextSpawnFrame = this.game.totalFrames + this.spawnFrames + salt;
        } else {
            this.nextSpawnFrame -= Math.random() + 1; // Affected by bee speed
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Bee(this.game);
    }
}

const Source = { imageId: "enemyFlyImg", width: 60, height: 44 };

class Bee extends Enemy {
    private angle: number;
    private va: number;

    constructor(game: Game) {
        super(game, Source.width, Source.height);
        this.name = "bee";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 6);
        this.rigidBody = new RigidBody();
        this.collider = new RectCollider(this);

        this.x = this.game.width + Math.random() * this.game.width * 0.5 + 100;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }

    public override onCollisionEnter(collision: Collision) {
        if (collision.other(this).type === "obstacle" && collision.direction === "left") {
            this.vy = -this.vx;
        } else {
            this.vy = 0;
        }
    }
}