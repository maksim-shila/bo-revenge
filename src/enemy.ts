import { Hitbox, NoHitbox, RectHitbox } from "./core/hitbox.js";
import Sprite, { SpriteConfig } from "./core/sprite.js";
import Timer from "./core/timer.js";
import Game from "./game.js";

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

export abstract class Enemy extends Sprite {
    public markedForDeletion: boolean;
    public hitbox: Hitbox;

    constructor(game: Game, config: SpriteConfig) {
        super(game, config);
        this.hitbox = new RectHitbox({ parent: this.rect });
        this.fps = 20;
        this.markedForDeletion = false;
    }

    public update(deltaTime: number): void {
        this.animate(deltaTime);
        this.x -= this.vx + this.game.speed;
        this.y += this.vy;
        if (this.isOffscreen("left")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.debug) {
            this.hitbox.draw(context);
        }
    }
}

class FlyingEnemy extends Enemy {
    private angle: number;
    private va: number;

    constructor(game: Game) {
        super(game, { imageId: "enemyFlyImg", width: 60, height: 44 });
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.framesCount = 6;
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
        super(game, { imageId: "enemyPlantImg", width: 60, height: 87 });
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vx = 0;
        this.vy = 0;
        this.framesCount = 2;
    }
}

class ClimbingEnemy extends Enemy {
    constructor(game: Game) {
        super(game, { imageId: "enemySpiderBigImg", width: 120, height: 144 });
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = 0;
        this.vy = Math.random() > 0.5 ? 1 : -1;
        this.framesCount = 6;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        if (this.isTouching("bottom")) {
            this.vy *= -1;
        }
        if (this.isOffscreen("top")) {
            this.markedForDeletion = true;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(this.x + this.width * 0.5, 0);
        context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
        context.stroke();
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
        super(game, { imageId: getRandomZombieImageId(), width: 562, height: 502, scale: 0.2 });
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vx = Math.random() * 1 + 1;
        this.vy = 0;
        this.fps = 30;
        this.framesCount = 10;
        this.hitbox = new NoHitbox();
    }
}