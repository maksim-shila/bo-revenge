import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { FrameTimer } from "../../../engine";

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

class Bee extends Enemy {
    private angle: number;
    private va: number;

    constructor(game: Game) {
        super(game, { imageId: "enemyFlyImg", width: 60, height: 44 });
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.framesCount = 6;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}