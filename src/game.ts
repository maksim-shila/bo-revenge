import InputHandler from "./input.js";
import Player from "./player.js";

export default class Game {

    private readonly input: InputHandler;

    public readonly width: number;
    public readonly height: number;
    public readonly player: Player;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.input = new InputHandler();
    }

    public update(deltaTime: number): void {
        this.player.update(this.input, deltaTime);
        this.input.update();
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.player.draw(context);
    }
}