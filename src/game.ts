import Background from "./background.js";
import CollisionAnimationFactory from "./collisionAnimation.js";
import EnemySpawner from "./enemy.js";
import InputHandler from "./input.js";
import ParticlesFactory from "./particles.js";
import Player from "./player.js";
import UI from "./UI.js";

export default class Game {

    public readonly input: InputHandler;
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
    public debug = false;
    public speed = this.maxSpeed;

    private time = 0;
    private maxTime = 2000;
    private gameOver = false;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ui = new UI(this);
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.player.setState("sitting");
        this.particles = new ParticlesFactory(this);
        this.collisions = new CollisionAnimationFactory(this);
        this.background = new Background(this);
        this.enemySpawner = new EnemySpawner(this);
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        if (this.time > this.maxTime) {
            this.gameOver = true;
        }
        this.input.update();
        this.background.update();
        this.particles.update();
        this.enemySpawner.update(deltaTime);
        this.collisions.update(deltaTime);
        this.player.update(this.input, deltaTime);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        this.enemySpawner.draw(context);
        this.collisions.draw(context);
        this.particles.draw(context);
        this.player.draw(context);
        this.ui.draw(context);
    }
}