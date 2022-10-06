export default class Canvas {

    private readonly canvas: HTMLCanvasElement;
    public readonly context: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;
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