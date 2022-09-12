import Background from "./background.js";
import InputHandler from "./input.js";
import Player from "./player.js";

export default class Game {

    private readonly input: InputHandler;

    public readonly width: number;
    public readonly height: number;
    public readonly groundMargin: number;
    public readonly player: Player;
    public readonly background: Background;

    public speed: number;
    public readonly maxSpeed: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.groundMargin = 80;
        this.speed = 0;
        this.maxSpeed = 6;
        this.input = new InputHandler();
        this.player = new Player(this);
        this.background = new Background(this);
    }

    public update(deltaTime: number): void {
        this.input.update();
        this.background.update();
        this.player.update(this.input, deltaTime);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.player.draw(context);
    }
}