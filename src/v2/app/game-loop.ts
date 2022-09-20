import Canvas from "./canvas.js";
import Game from "./game.js";
import GlobalConfig from "./global-config.js";

export default class GameLoop {

    private readonly _globalConfig: GlobalConfig;
    private readonly _canvas: Canvas;
    private readonly _game: Game;
    private _lastTime = 0;

    constructor() {
        this._globalConfig = new GlobalConfig();
        this._canvas = new Canvas("gameCanvas", this._globalConfig);
        this._game = new Game(this._globalConfig);

        this._canvas.show();
    }

    public run(timestamp: number): void {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;

        this._canvas.clear();
        this._game.update(deltaTime);
        this._game.draw(this._canvas.context);

        requestAnimationFrame((timestamp) => this.run(timestamp));
    }
}