import { AnimationRow } from "../../core/animation/animation.js";
import Painter from "../../core/animation/painter.js";
import Dimension from "../../core/dimension.js";
import { NoHitbox } from "../../core/hitbox.js";
import ScreenObject from "../../core/screen-object.js";
import Timer from "../../core/utils/timer.js";
import Game from "../../game.js";

export default class EnemySpawner {
    private readonly game: Game;
    private _enemies: Enemy[];

    private readonly spawners: Timer[];

    constructor(game: Game) {
        this.game = game;
        this._enemies = [];
        this.spawners = [
            new Timer(() => this.spawnZombie(), 3000),
            new Timer(() => this.spawnPlant(), 1000),
            new Timer(() => this.spawnBee(), 1000),
            new Timer(() => this.spawnSpider(), 1000)
        ];
    }

    public get enemies(): Enemy[] {
        return this._enemies;
    }

    public update(deltaTime: number): void {
        this.spawners.forEach(spawner => spawner.update(deltaTime));
        this._enemies.forEach(e => e.update(deltaTime));
        this._enemies = this._enemies.filter(e => !e.markedForDeletion);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._enemies.forEach(e => e.draw(context));
    }

    private spawnZombie(): void {
        if (Math.random() > 0.7) {
            this._enemies.push(new Zombie(this.game));
        }
    }

    private spawnPlant(): void {
        if (this.game.speed > 0 && Math.random() > 0.5) {
            this._enemies.push(new GroundEnemy(this.game));
        }
    }

    private spawnBee(): void {
        this._enemies.push(new FlyingEnemy(this.game));
    }

    private spawnSpider(): void {
        if (this.game.speed > 0) {
            this._enemies.push(new ClimbingEnemy(this.game));
        }
    }
}

export abstract class Enemy extends ScreenObject {
    private readonly _game: Game;
    protected readonly _painter: Painter;
    public markedForDeletion: boolean;

    constructor(game: Game, spawnX: number, spawnY: number, dimension: Dimension, imageId: string) {
        super("enemy", game, spawnX, spawnY, dimension);
        this._game = game;
        this._painter = new Painter(this, imageId, dimension, game.globalConfig);
        this._painter.fps = 20;
        this.markedForDeletion = false;
    }

    public update(deltaTime: number): void {
        this._painter.update(deltaTime);
        this.x -= this.vx + this._game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.markedForDeletion = true;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._painter.draw(context);
    }
}

class FlyingEnemy extends Enemy {
    private angle: number;
    private va: number;

    constructor(game: Game) {
        const dimension = new Dimension({ sw: 60, sh: 44 });
        const spawnX = game.width + Math.random() * game.width * 0.5;
        const spawnY = Math.random() * game.height * 0.5;
        super(game, spawnX, spawnY, dimension, "enemyFlyImg");

        this._painter.animation = new AnimationRow(0, 6);
        this.vx = Math.random() + 1;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

class GroundEnemy extends Enemy {
    constructor(game: Game) {
        const dimension = new Dimension({ sw: 60, sh: 87 });
        const spawnX = game.width;
        const spawnY = game.height - dimension.height - game.floorHeight;
        super(game, spawnX, spawnY, dimension, "enemyPlantImg");

        this._painter.animation = new AnimationRow(0, 2);
        this.vx = 0;
        this.vy = 0;
    }
}

class ClimbingEnemy extends Enemy {
    constructor(game: Game) {
        const dimension = new Dimension({ sw: 120, sh: 144 });
        const spawnX = game.width;
        const spawnY = Math.random() * game.height * 0.5;
        super(game, spawnX, spawnY, dimension, "enemySpiderBigImg");

        this._painter.animation = new AnimationRow(0, 6);
        this.vx = 0;
        this.vy = Math.random() > 0.5 ? 1 : -1;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        if (this.isTouchingScreen("bottom")) {
            this.vy *= -1;
        }
        if (this.isOffscreen("top")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.beginPath();
        context.strokeStyle = "black";
        context.moveTo(this.x + this.width * 0.5, 0);
        context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
        context.stroke();
        context.restore();
        super.draw(context);
    }
}

const zombieImages = ["zombieGreenImg", "zombieOrangeImg", "zombiePurpleImg"];
function getRandomZombieImageId(): string {
    let index = Math.floor(Math.random() * 3);
    if (index === 3) {
        index--;
    }
    return zombieImages[index];
}

class Zombie extends Enemy {
    constructor(game: Game) {
        const dimension = new Dimension({ sw: 562, sh: 502, scale: 0.2 });
        const spawnX = game.width;
        const spawnY = game.height - dimension.height - game.floorHeight;
        super(game, spawnX, spawnY, dimension, getRandomZombieImageId());

        this._painter.animation = new AnimationRow(0, 10);
        this._painter.fps = 30
        this.vx = Math.random() * 1 + 1;
        this.vy = 0;
        this.hitbox = new NoHitbox();
    }
}