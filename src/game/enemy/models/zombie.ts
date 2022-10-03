import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { BlankCollider, RectCollider } from "../../../engine/collision/Collider";
import { Collision, FrameTimer, RigidBody } from "../../../engine";

const zombieImages = ["zombieGreenImg", "zombieOrangeImg", "zombiePurpleImg"];
function getRandomZombieImageId(): string {
    let index = Math.floor(Math.random() * 3);
    if (index === 3) {
        index--;
    }
    return zombieImages[index];
}

export default class ZombieSpawner implements Spawner {
    private readonly game: Game;
    private readonly spawnFrames = 2000;
    private nextSpawnFrame = this.spawnFrames;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.game.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 3000 + 1000;
            this.nextSpawnFrame = this.game.totalFrames + this.spawnFrames + salt;
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
        this.x = this.game.width + 50; // move spawn offscreen to have time until plant falls
        this.y = this.game.height - this.height - 200;
        this.vx = Math.random() * 1 + 1;
        this.vy = 0;
        this.fps = 30;
        this.framesCount = 10;
        this.collider = new RectCollider(this);
        this.rigidBody = new RigidBody(20);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (!this.onGround) {
            this.y += this.weight;
        }
    }
}