import * as Bad from "bad-engine";
import Player from "../../../common/Player";
import { Enemy } from "./Enemy";
import BeeSpawner from "./Bee";
import PlantSpawner from "./Plant";
import SpiderSpawner from "./Spider";
import ZombieSpawner from "./Zombie";

export default class EnemySpawner extends Bad.GameObjectContainer {

    private readonly spawners: Spawner[];

    constructor(private readonly player: Player, scene: Bad.Scene) {
        super(scene);
        this.spawners = [
            new BeeSpawner(this.scene),
            new PlantSpawner(this.scene),
            new SpiderSpawner(this.scene),
            new ZombieSpawner(this.scene)
        ];
    }

    public override update(frame: Bad.Frame): void {
        this.spawners.forEach(spawner => {
            spawner.update(frame);
            if (spawner.shouldSpawn && !Bad.Global.cheats.preventEnemiesSpawn) {
                const enemy = spawner.spawn();
                this.scene.addObject(enemy);
                this.scene.colliders.watch([this.player], [enemy]);
            }
        });
    }
}

export interface Spawner {
    shouldSpawn: boolean;
    update(frameTimer: Bad.Frame): void;
    spawn(): Enemy;
}