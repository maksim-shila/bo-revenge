import GameConfig from "../global.js";
import Background from "./background.js";
import CollisionAnimationFactory from "./collisionAnimation.js";
import EnemySpawner from "./enemy.js";
import InputHandler from "../input.js";
import ParticlesFactory from "./particles.js";
import Player from "./player.js";
import UI from "./UI.js";

export default class Game {

    public readonly config: GameConfig;
    public readonly player: Player;
    public readonly particles: ParticlesFactory;
    public readonly collisions: CollisionAnimationFactory;
    public readonly enemySpawner: EnemySpawner;
    public readonly background: Background;
    public readonly ui: UI;

    public readonly width: number;
    public readonly height: number;
    public readonly groundMargin = 80;
    public readonly maxSpeed = 3;

    public score = 0;
    public speed = this.maxSpeed;
    public paused = false;
    public running = false;

    public onPause: () => unknown = () => { };
    public onContinue: () => unknown = () => { };

    constructor(config: GameConfig) {
        this.config = config;
        this.width = config.width;
        this.height = config.height;
        this.ui = new UI(this);
        this.player = new Player(this);
        this.player.setState("sitting");
        this.particles = new ParticlesFactory(this);
        this.collisions = new CollisionAnimationFactory(this);
        this.background = new Background(this);
        this.enemySpawner = new EnemySpawner(this);
    }

    public update(input: InputHandler, deltaTime: number): void {
        if (input.lockKeyPressed("pause")) {
            this.paused ? this.continue() : this.pause();
        }
        if (!this.paused) {
            this.background.update();
            this.particles.update();
            this.enemySpawner.update(deltaTime);
            this.collisions.update(deltaTime);
            this.player.update(input, deltaTime);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.enemySpawner.draw(context);
        this.collisions.draw(context);
        this.particles.draw(context);
        this.player.draw(context);
        this.ui.draw(context);
    }

    public pause(): void {
        this.paused = true;
        this.onPause();
    }

    public continue(): void {
        this.paused = false;
        this.onContinue();
    }
}