import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { FrameTimer, RigidBody } from "../../../engine";

export default class PlantSpawner implements Spawner {
    private readonly game: Game;
    private spawnFrames = 300;
    private nextSpawnFrame = this.spawnFrames;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void { }

    public get shouldSpawn(): boolean {
        const shouldSpawn = this.game.totalFrames > this.nextSpawnFrame;
        if (shouldSpawn) {
            const salt = Math.random() * 500 + 0;
            this.nextSpawnFrame = this.game.totalFrames + this.spawnFrames + salt;
        }
        return shouldSpawn;
    }

    public spawn(): Enemy {
        return new Plant(this.game);
    }
}

class Plant extends Enemy {
    constructor(game: Game) {
        super(game, { imageId: "enemyPlantImg", width: 60, height: 87 });
        this.x = this.game.width + 50; // move spawn offscreen to have time until plant falls
        this.y = this.game.height - this.height - 300;
        this.vx = 0;
        this.vy = 0;
        this.framesCount = 2;
        this.rigidBody = new RigidBody(20);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (!this.onGround) {
            this.y += this.weight;
        }
    }
}