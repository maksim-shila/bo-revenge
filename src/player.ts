import { Hitbox, RectHitbox } from "./core/hitbox.js";
import Sprite, { SpriteConfig } from "./core/sprite.js";
import Game from "./game.js";
import InputHandler from "./input.js";
import { PlayerStateManager, PlayerStateType, State } from "./player_states.js";

const playerConfig: SpriteConfig = {
    imageId: "playerImg",
    width: 100.3,
    height: 91.3
};

export default class Player extends Sprite {

    public stateManager: PlayerStateManager;
    public state: State;

    public readonly hitbox: Hitbox = new RectHitbox({ parent: this.rect });
    public readonly maxVX: number;
    public readonly maxVY: number;
    public readonly weight: number;

    constructor(game: Game) {
        super(game, playerConfig);
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.hitbox = new RectHitbox({ parent: this.rect });
        this.maxVX = 10;
        this.maxVY = 30;
        this.weight = 2;
        this.stateManager = new PlayerStateManager(this);
        this.state = this.stateManager.get("running");
        this.state.init();
    }

    public update(input: InputHandler, deltaTime: number): void {
        this.checkCollision();
        this.animate(deltaTime);
        this.state.update(input);
        this.moveX();
        this.moveY();
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.debug) {
            this.hitbox.draw(context);
        }
    }
    public setState(type: PlayerStateType): void {
        this.state = this.stateManager.get(type);
        this.state.init();
    }

    public onGround(): boolean {
        return this.isTouching("bottom");
    }

    private moveX(): void {
        this.x += this.vx;
        this.disallowOffscreen("left");
        this.disallowOffscreen("right");
    }

    private moveY(): void {
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        }
        this.disallowOffscreen("bottom");
    }

    private checkCollision(): void {
        this.game.enemySpawner.enemies.forEach(enemy => {
            if (this.hitbox.hasCollision(enemy.hitbox)) {
                enemy.markedForDeletion = true;
                this.game.score++;
            }
        });
    }
}