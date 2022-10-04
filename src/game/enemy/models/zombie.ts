import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { Collision, FrameTimer, RectCollider, RigidBody } from "../../../engine";

const zombieImages = ["zombieGreenImg", "zombieOrangeImg"];
function getRandomZombieImageId(): string {
    let index = Math.floor(Math.random() * 2);
    if (index === 3) {
        index--;
    }
    return zombieImages[index];
}

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

class Zombie extends Enemy {
    constructor(game: Game) {
        super(game, { imageId: getRandomZombieImageId(), width: 562, height: 502, scale: 0.2 });
        this.type = "zombie";
        this.x = this.game.width + 100; // move spawn offscreen to have time until plant falls
        this.y = this.game.height - this.height - 200;
        this.vx = Math.random() * 1 + 1;
        this.vy = 0;
        this.fps = 30;
        this.framesCount = 10;
        this.collider = new RectCollider(this, 10, 0, -20, 0);
        this.rigidBody = new RigidBody(2);
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