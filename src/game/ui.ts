import { FontFamily } from "./core/fonts.js";
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
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "white";
        context.shadowBlur = 0;
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText(`Score: ${this.game.score}`, 20, 50);

        context.font = `"${this.fontSize * 0.8}px ${this.fontFamily}`;
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);

        if (this.game.gameOver) {
            context.textAlign = "center";
            if (this.game.score > 20) {
                context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
                context.fillText("Boo-yah", this.game.width * 0.5, this.game.height * 0.5);
                context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                context.fillText("What are creatures of the night affraid of? YOU!!!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
                context.fillText("Love at first bite?", this.game.width * 0.5, this.game.height * 0.5);
                context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                context.fillText("Nope, better luck next time!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}