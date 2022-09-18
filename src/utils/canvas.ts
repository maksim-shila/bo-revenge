import GameConfig from "../global";

export default class Canvas {

    private readonly canvas: HTMLCanvasElement;
    public readonly context: CanvasRenderingContext2D;

    constructor(gameConfig: GameConfig) {
        this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.canvas.width = gameConfig.width;
        this.canvas.height = gameConfig.height;
        this.context = this.canvas.getContext("2d")!;
    }

    public show(): void {
        this.canvas.style.display = "block";
    }

    public hide(): void {
        this.canvas.style.display = "none";
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}