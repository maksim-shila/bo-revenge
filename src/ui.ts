import { FontFamily } from "./core/font.js";
import Game from "./game.js";

export default class UI {

    private readonly game: Game;
    private readonly fontSize: number;
    private readonly fontFamily: FontFamily;

    constructor(game: Game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Helvetica";
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText(`Score: ${this.game.score}`, 20, 50);
    }
}