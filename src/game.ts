import Background from "./background.js";
import EnemySpawner from "./enemySpawner.js";
import InputHandler from "./input.js";
import Player from "./player.js";
import UI from "./UI.js";

export default class Game {

    public readonly input: InputHandler;
    public readonly player: Player;
    public readonly enemySpawner: EnemySpawner;
    public readonly background: Background;
    public readonly ui: UI;

    public readonly width: number;
    public readonly height: number;
    public readonly groundMargin: number;

    public score: number;
    public debug: boolean;

    public speed: number;
    public readonly maxSpeed: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.groundMargin = 80;
        this.maxSpeed = 6;
        this.speed = this.maxSpeed;
        this.debug = false;
        this.score = 0;
        this.ui = new UI(this);
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.background = new Background(this);
        this.enemySpawner = new EnemySpawner(this);
    }

    public update(deltaTime: number): void {
        this.input.update();
        this.background.update();
        this.player.update(this.input, deltaTime);
        this.enemySpawner.update(deltaTime);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.enemySpawner.draw(context);
        this.player.draw(context);
        this.ui.draw(context);
    }
}