import InputHandler from "./core/input/input-handler.js";
import GlobalConfig from "./global-config.js";
import Player from "./player/player.js";

export default class Game {

    public readonly globalConfig: GlobalConfig;
    public readonly player: Player;
    public readonly input: InputHandler;

    constructor(globalConfig: GlobalConfig) {
        this.globalConfig = globalConfig;
        this.player = new Player(0, 300);
        this.input = new InputHandler(this.globalConfig);
    }

    public update(deltaTime: number): void {
        this.input.update();
        this.player.update(deltaTime, this.input);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.player.draw(context);
    }
}