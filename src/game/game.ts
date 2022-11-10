import * as Bad from "bad-engine";
import DebugWindow from "./debug-window";
import UI from "./UI";
import Scene1 from "./scenes/scene1/Scene1";
import Scene2 from "./scenes/scene2/Scene2";
import { Actions } from "../input/Controls";
import Canvas from "../utils/canvas";
import GameMenu from "./gameMenu";

export default class Game {

    private scene: Bad.Scene | null = null;
    private ui: UI | null = null;
    private debugWindow: DebugWindow | null = null;
    private canvas: Canvas;
    private menu: GameMenu;

    private readonly input: () => Bad.Input;

    public readonly width: number;
    public readonly height: number;

    public score = 0;
    public paused = false;
    private _running = false;

    public onStop: () => unknown = () => { };

    constructor(width: number, height: number, input: () => Bad.Input) {
        this.width = width;
        this.height = height;
        this.canvas = new Canvas(width, height);
        this.input = input;
        this.menu = new GameMenu(this);
    }

    public get running(): boolean {
        return this._running;
    }

    public start(): void {
        this.canvas.show();
        this.startScene1();
        this._running = true;
    }

    public reset(): void {
        this.canvas.hide();
        this._running = false;
        this.paused = false;
        this.debugWindow = null;
        this.ui = null;
        this.score = 0;
        this.scene?.destroy();
        this.scene = null;
    }

    public stop(): void {
        this.reset();
        this.onStop();
    }

    public restart(): void {
        this.reset();
        this.start();
    }

    public pause(): void {
        this.paused = true;
        this.menu.show();
    }

    public continue(): void {
        this.paused = false;
        this.menu.hide();
    }

    public update(input: () => Bad.Input, frame: Bad.Frame): void {
        if (!this._running) {
            return;
        }
        if (this.scene === null || this.debugWindow === null || this.ui === null) {
            throw new Error("Couldn't call game.update() since scene not ready");
        }
        if (this.paused) {
            this.menu.update(input);
            return;
        }
        this.scene.update(frame);
        if (Bad.Global.debug) {
            this.debugWindow.update(input, frame);
        }
        if (input().keyDownOnce(Actions.Pause)) {
            this.pause();
        }
    }

    public draw(): void {
        if (!this._running) {
            return;
        }
        if (this.scene === null || this.debugWindow === null || this.ui === null) {
            throw new Error("Couldn't call game.draw() since scene not ready");
        }
        if (this.paused) {
            return;
        }
        this.canvas.clear();
        this.scene.draw(this.canvas.context);
        this.ui.draw(this.canvas.context);
        if (Bad.Global.debug) {
            this.debugWindow.draw(this.canvas.context);
        }
    }

    private startScene1() {
        const scene = new Scene1(this, this.input);
        this.scene = scene;
        this.ui = new UI(this, scene.player);
        this.debugWindow = new DebugWindow(scene.player, scene);
    }

    private startScene2() {
        const scene = new Scene2(this, this.input);
        this.scene = scene;
        this.ui = new UI(this, scene.player);
        this.debugWindow = new DebugWindow(scene.player, scene);
    }
}