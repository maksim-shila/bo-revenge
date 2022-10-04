import { FrameTimer, Scene } from "../engine";
import GameConfig from "../global";
import InputHandler from "../input/input-handler";
import Background from "./background";
import CollisionAnimationFactory from "./collisionAnimation";
import DebugWindow from "./debug-window";
import EnemySpawner from "./enemy/enemy-spawner";
import ParticlesFactory from "./particles";
import Player from "./player";
import BrickFloor from "./sprites/obstacles/BrickFloor";
import { BrickWall } from "./sprites/obstacles/BrickWall";
import UI from "./UI";

export default class Game {

    public readonly config: GameConfig;
    public readonly player: Player;
    public readonly particles: ParticlesFactory;
    public readonly collisions: CollisionAnimationFactory;
    public readonly enemySpawner: EnemySpawner;
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

    constructor(config: GameConfig, input: InputHandler) {
        this.config = config;
        this.width = config.width;
        this.height = config.height;
        this.ui = new UI(this);
        this.debugWindow = new DebugWindow(this);
        this.player = new Player(this, input);
        this.player.setState("sitting");
        this.particles = new ParticlesFactory(this);
        this.collisions = new CollisionAnimationFactory(this);
        this.background = new Background(this);
        this.enemySpawner = new EnemySpawner(this);
        this.soundtrack = document.getElementById("level1audio") as HTMLAudioElement;
        this.soundtrack.addEventListener("ended", () => this.playSoundtrack());

        this.scene = new Scene("scene", 0, 0, config.width, config.height);
        this.scene.addObject(this.player);
        this.scene.addContainer(new BrickFloor(this));
        this.scene.addObject(new BrickWall(this, Math.floor(this.width / 3) * 1));
        this.scene.addObject(new BrickWall(this, Math.floor(this.width / 3) * 2));
        this.scene.addObject(new BrickWall(this, Math.floor(this.width / 3) * 3));
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
        this.debugWindow.update(input, frameTimer);
        if (input.keyPressedOnce("pause")) {
            this.paused ? this.continue() : this.pause();
        }
        if (!this.paused) {
            this.background.update();
            this.scene.update(frameTimer);
            this.particles.update();
            this.enemySpawner.update(frameTimer);
            this.collisions.update(frameTimer);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.scene.draw(context);
        this.collisions.draw(context);
        this.particles.draw(context);
        this.ui.draw(context);
        if (this.config.debug) {
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