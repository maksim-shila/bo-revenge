import GlobalConfig from "./global-config.js";

export default class Canvas {

    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    constructor(id: string, config: GlobalConfig) {
        this._canvas = document.getElementById(id) as HTMLCanvasElement;
        this._canvas.width = config.width;
        this._canvas.height = config.height;
        this._context = this._canvas.getContext("2d")!;
    }

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public show(): void {
        this._canvas.style.display = "block";
    }

    public hide(): void {
        this._canvas.style.display = "none";
    }

    public clear(): void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}