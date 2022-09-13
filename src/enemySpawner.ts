import Timer from "./core/timer.js";
import Enemy, { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./enemy.js";
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
        if (this.game.speed > 0) {
            if (Math.random() > 0.5) {
                this.enemies.push(new GroundEnemy(this.game));
            }
            this.enemies.push(new ClimbingEnemy(this.game));
        }
        this.enemies.push(new FlyingEnemy(this.game));
    }
}