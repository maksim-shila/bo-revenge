import { FrameTimer, Global, Scene } from "../engine";
import InputHandler from "../input/input-handler";
import DebugWindow from "./debug-window";
import UI from "./UI";
import Scene1 from "./scenes/scene1/Scene1";

export default class Game {

    private scene: Scene | null = null;
    private ui: UI | null = null;
    private debugWindow: DebugWindow | null = null;

    private readonly input: InputHandler;

    public readonly width: number;
    public readonly height: number;

    public score = 0;
    public paused = false;
    private _running = false;

    public onPause: () => unknown = () => { };
    public onContinue: () => unknown = () => { };

    private _totalFrames = 0;

    constructor(width: number, height: number, input: InputHandler) {
        this.width = width;
        this.height = height;
        this.input = input;
    }

    public get running(): boolean {
        return this._running;
    }

    public get totalFrames(): number {
        return this._totalFrames;
    }

    public start(): void {
        this.startScene1();
        this._running = true;
    }

    public stop(): void {
        this._running = false;
        this.scene?.destroy();
    }

    public pause(): void {
        this.paused = true;
        this.onPause();
    }

    public continue(): void {
        this.paused = false;
        this.onContinue();
    }

    public update(input: InputHandler, frameTimer: FrameTimer): void {
        if (this.scene === null || this.debugWindow === null || this.ui === null) {
            throw new Error("Couldn't call game.update() since scene not ready");
        }
        this._totalFrames += Math.abs(this.scene.vx); // Used as condition for enemies spawn. Not good place for it
        if (input.keyPressedOnce("pause")) {
            this.paused ? this.continue() : this.pause();
        }
        if (!this.paused) {
            this.scene.update(frameTimer);
        }
        if (Global.debug) {
            this.debugWindow.update(input, frameTimer);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.scene === null || this.debugWindow === null || this.ui === null) {
            throw new Error("Couldn't call game.draw() since scene not ready");
        }
        this.scene.draw(context);
        this.ui.draw(context);
        if (Global.debug) {
            this.debugWindow.draw(context);
        }
    }

    private startScene1() {
        const scene = new Scene1(this, this.input);
        scene.vx = -3;
        scene.vx_default = -3;

        this.scene = scene;
        this.ui = new UI(this, scene.player);
        this.debugWindow = new DebugWindow(scene.player, scene);
    }
}