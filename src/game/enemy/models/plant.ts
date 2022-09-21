import Game from "../../game.js";
import { Spawner } from "../enemy-spawner.js";
import { Enemy } from "../enemy.js";

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
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vx = 0;
        this.vy = 0;
        this.framesCount = 2;
    }
}