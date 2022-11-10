import * as Bad from "bad-engine";
import Player from "../../../common/Player";
import { Enemy } from "./Enemy";
import BeeSpawner from "./Bee";
import PlantSpawner from "./Plant";
import SpiderSpawner from "./Spider";
import ZombieSpawner from "./Zombie";

export default class EnemySpawner extends Bad.GameObject {

    private readonly spawners: Spawner[];

    constructor(private readonly player: Player, scene: Bad.Scene) {
        super("enemySpawner", scene);
        this.spawners = [
            new BeeSpawner(this.scene),
            new PlantSpawner(this.scene),
            new SpiderSpawner(this.scene),
            new ZombieSpawner(this.scene)
        ];
    }

    public override update(): void {
        this.spawners.forEach(spawner => {
            if (spawner.shouldSpawn && !Bad.Global.cheats.preventEnemiesSpawn) {
                const enemy = spawner.spawn();
                this.scene.add(enemy, this.order);
                this.scene.colliders.watch([this.player], [enemy]);
            }
        });
    }
}

export interface Spawner {
    shouldSpawn: boolean;
    spawn(): Enemy;
}