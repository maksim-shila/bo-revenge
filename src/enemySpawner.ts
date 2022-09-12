import Timer from "./core/timer.js";
import Enemy, { FlyingEnemy } from "./enemy.js";
import Game from "./game.js";

export default class EnemySpawner {

    public readonly game: Game;
    public enemies: Enemy[];
    private timer: Timer;

    constructor(game: Game) {
        this.game = game;
        this.enemies = [];
        this.timer = new Timer(() => this.addEnemy(), 1000);
    }

    public update(deltaTime: number): void {
        this.timer.update(deltaTime);
        this.enemies.forEach(e => {
            e.update(deltaTime);
            if (e.markedForDeletion) {
                this.enemies.splice(this.enemies.indexOf(e), 1);
            }
        });
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.enemies.forEach(e => e.draw(context));
    }

    private addEnemy(): void {
        this.enemies.push(new FlyingEnemy(this.game));
    }
}