import Game from "./game";

export default class UI {

    private readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "white";
        context.shadowBlur = 0;

        context.font = "30px Helvetica";
        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText(`Score: ${this.game.score}`, 20, 50);

        const player = this.game.player;
        const maxEnergyWidth = 200;
        const energyWidth = maxEnergyWidth * player.energy / player.maxEnergy;
        context.strokeStyle = "black";
        context.strokeRect(20, 70, maxEnergyWidth, 10);
        context.fillStyle = player.energy > player.minEnergy ? "black" : "gray";
        context.fillRect(20, 70, energyWidth, 10);
        context.restore();
    }
}