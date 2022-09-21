import Background from "./sprites/background/background.js";
import InputHandler from "./core/input/input-handler.js";
import GlobalConfig from "./global-config.js";
import BrickFloor from "./sprites/obstacles/brick-floor.js";
import Obstacle from "./sprites/obstacles/obstacle.js";
import Player from "./sprites/player/player.js";
import EnemySpawner from "./sprites/enemies/enemy.js";

export default class Game {

    public readonly width: number;
    public readonly height: number;

    public readonly globalConfig: GlobalConfig;
    public speed = 1;
    public speedCap = 3;

    public readonly player: Player;
    public readonly input: InputHandler;
    private readonly floor: BrickFloor;
    private readonly background: Background;
    private readonly enemySpawner: EnemySpawner;

    constructor(globalConfig: GlobalConfig) {
        this.globalConfig = globalConfig;
        this.width = this.globalConfig.width;
        this.height = this.globalConfig.height;
        this.player = new Player(this, 0, 300);
        this.input = new InputHandler(this.globalConfig);
        this.floor = new BrickFloor(this);
        this.background = new Background(this);
        this.enemySpawner = new EnemySpawner(this);
    }

    public get floorHeight(): number {
        return this.floor.height;
    }

    public get obstacles(): Obstacle[] {
        return this.floor.obstacles;
    }

    public update(deltaTime: number): void {
        this.input.update();
        this.background.update();
        this.floor.update();
        this.enemySpawner.update(deltaTime);
        this.player.update(deltaTime, this.input);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.floor.draw(context);
        this.enemySpawner.draw(context);
        this.player.draw(context);
    }
}