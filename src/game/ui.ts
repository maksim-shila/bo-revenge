import Game from "./game";
import Player from "./common/Player";

export default class UI {

    constructor(
        private readonly game: Game,
        private readonly player: Player
    ) { }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "white";
        context.shadowBlur = 0;

        context.font = "30px Helvetica";
        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText(`Score: ${this.game.score}`, this.game.width - 300, 50);

        const maxEnergyWidth = 200;
        const energyWidth = maxEnergyWidth * this.player.energy / this.player.maxEnergy;
        context.strokeStyle = "black";
        context.strokeRect(this.game.width - 300, 70, maxEnergyWidth, 10);
        context.fillStyle = this.player.energy > this.player.minEnergy ? "black" : "gray";
        context.fillRect(this.game.width - 300, 70, energyWidth, 10);
        context.restore();
    }
}