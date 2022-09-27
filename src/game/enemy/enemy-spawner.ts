import { FrameTimer } from "../../utils/frame-timer.js";
import Game from "../game.js";
import { Enemy } from "./enemy.js";
import BeeSpawner from "./models/bee.js";
import PlantSpawner from "./models/plant.js";
import SpiderSpawner from "./models/spider.js";
import ZombieSpawner from "./models/zombie.js";

export default class EnemySpawner {
    private readonly game: Game;
    private _enemies: Enemy[];

    private readonly spawners: Spawner[];

    constructor(game: Game) {
        this.game = game;
        this._enemies = [];
        this.spawners = [
            new BeeSpawner(this.game),
            new PlantSpawner(this.game),
            new SpiderSpawner(this.game),
            new ZombieSpawner(this.game)
        ];
    }

    public get enemies(): Enemy[] {
        return this._enemies;
    }

    public update(frameTimer: FrameTimer): void {
        this.spawners.forEach(spawner => {
            spawner.update(frameTimer);
            if (spawner.shouldSpawn) {
                this.enemies.push(spawner.spawn());
            }
        });
        this._enemies.forEach(e => e.update(frameTimer));
        this._enemies = this._enemies.filter(e => !e.markedForDeletion);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._enemies.forEach(e => e.draw(context));
    }
}

export interface Spawner {
    shouldSpawn: boolean;
    update(frameTimer: FrameTimer): void;
    spawn(): Enemy;
}