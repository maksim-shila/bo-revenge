import { FrameTimer, Global, Scene } from "../engine";
import InputHandler from "../input/input-handler";
import Background from "./background";
import DebugWindow from "./debug-window";
import EnemySpawner from "./sprites/enemies/EnemySpawner";
import Player from "./sprites/Player";
import BrickFloor from "./sprites/obstacles/BrickFloor";
import { BrickWallSpawner } from "./sprites/obstacles/BrickWall";
import UI from "./UI";

export default class Game {

    public readonly background: Background;
    public readonly ui: UI;
    public readonly scene: Scene;

    private readonly debugWindow: DebugWindow;
    private readonly soundtrack: HTMLAudioElement;

    public readonly width: number;
    public readonly height: number;
    public readonly maxSpeed = 3;

    public score = 0;
    public speed = this.maxSpeed;
    public paused = false;
    private _running = false;

    public onPause: () => unknown = () => { };
    public onContinue: () => unknown = () => { };

    private _totalFrames = 0;

    constructor(width: number, height: number, input: InputHandler) {
        this.width = width;
        this.height = height;
        this.soundtrack = document.getElementById("level1audio") as HTMLAudioElement;
        this.soundtrack.addEventListener("ended", () => this.playSoundtrack());

        this.scene = new Scene(this.width, this.height);
        this.scene.vx = -3;
        this.scene.vx_default = -3;

        const player = new Player(this, this.scene, input);
        this.background = new Background(this.scene);

        this.scene.add(player);
        this.scene.add(new BrickFloor(this.scene));
        this.scene.add(new BrickWallSpawner(this.scene));
        this.scene.add(new EnemySpawner(player, this.scene));

        this.ui = new UI(this, player);
        this.debugWindow = new DebugWindow(player, this.scene);
    }

    public get running(): boolean {
        return this._running;
    }

    public get totalFrames(): number {
        return this._totalFrames;
    }

    public start(): void {
        this.playSoundtrack();
        this._running = true;
    }

    public stop(): void {
        this.soundtrack.pause();
        this.soundtrack.currentTime = 0;
        this._running = false;
    }

    public update(input: InputHandler, frameTimer: FrameTimer): void {
        this._totalFrames += this.speed;
        if (input.keyPressedOnce("pause")) {
            this.paused ? this.continue() : this.pause();
        }
        if (!this.paused) {
            this.background.update();
            this.scene.update(frameTimer);
        }
        if (Global.debug) {
            this.debugWindow.update(input, frameTimer);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.scene.draw(context);
        this.ui.draw(context);
        if (Global.debug) {
            this.debugWindow.draw(context);
        }
    }

    public pause(): void {
        this.paused = true;
        this.onPause();
    }

    public continue(): void {
        this.paused = false;
        this.onContinue();
    }

    private playSoundtrack(): void {
        this.soundtrack.play();
    }
}