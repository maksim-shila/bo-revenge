import Game from "../../game";
import { Spawner } from "../enemy-spawner";
import { Enemy } from "../enemy";
import { AnimationRow, Animator, FrameTimer, RectCollider, RigidBody } from "../../../engine";

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

const Source = { imageId: "enemyPlantImg", width: 60, height: 87 };

class Plant extends Enemy {
    constructor(game: Game) {
        super(game, Source.width, Source.height);
        this.name = "plant";

        this.animator = new Animator(Source.imageId, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new AnimationRow(0, 2);
        this.rigidBody = new RigidBody(2);
        this.collider = new RectCollider(this);

        this.x = this.game.width + 200; // move spawn offscreen to have time until plant falls
        this.y = this.game.height - this.height - 100;
        this.vx = 0;
        this.vy = 0;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (!this.onGround) {
            this.vy += this.weight;
        }
    }
}