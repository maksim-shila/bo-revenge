import InputHandler from "../input/input-handler";
import { FrameTimer } from "../utils/frame-timer";
import { Hitbox, RectHitbox } from "./core/hitbox";
import Sprite, { SpriteConfig } from "./core/sprite";
import Game from "./game";
import { PlayerStateManager, PlayerStateType, State } from "./playerStates";

const playerConfig: SpriteConfig = {
    imageId: "playerImg",
    width: 100.3,
    height: 91.3
};

export default class Player extends Sprite {

    public stateManager: PlayerStateManager;
    public state!: State; // Initialized on Game class constructor

    public readonly hitbox: Hitbox = new RectHitbox({ parent: this.rect });
    public readonly maxVX: number;
    public readonly maxVY: number;
    public readonly weight: number;

    private _jumps = 0;
    private jumpPressed = false;
    public noGravity = false;

    private readonly dashCD = 800;
    private dashTimer: NodeJS.Timeout | null = null;

    public readonly maxEnergy = 50;
    public readonly minEnergy = 10;
    private _energy = this.maxEnergy;

    constructor(game: Game) {
        super(game, playerConfig);
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.hitbox = new RectHitbox({
            parent: this.rect,
            xCounter: (parent): number => parent.x + 20,
            yCounter: (parent): number => parent.y + 40,
            width: this.width - 40,
            height: this.height - 40
        });
        this.maxVX = 10;
        this.maxVY = 30;
        this.weight = 2;
        this.stateManager = new PlayerStateManager(this.game);
    }

    public get energy(): number {
        return this._energy;
    }

    public set energy(value: number) {
        if (value < 0) {
            this.energy = 0;
        } else if (value > this.maxEnergy) {
            this._energy = this.maxEnergy;
        } else {
            this._energy = value;
        }
    }

    public get canStartRoll(): boolean {
        return this._energy > this.minEnergy;
    }

    public get jumps(): number {
        return this._jumps;
    }

    public get dashInCD(): boolean {
        return this.dashTimer !== null;
    }

    public set dashInCD(value: boolean) {
        if (value) {
            this.dashTimer = setTimeout(() => { this.dashTimer = null; }, this.dashCD);
        } else if (this.dashTimer) {
            clearTimeout(this.dashTimer);
            this.dashTimer = null;
        }
    }

    public update(input: InputHandler, frameTimer: FrameTimer): void {
        this.checkCollision(input);
        this.animate(frameTimer);
        this.state.update(input);
        this.moveX();
        this.moveY();
        if (input.keyReleased("jump") && this.jumpPressed) {
            if (!this.onGround() && this.vy < 0) {
                this.vy = this.vy < -5 ? -5 : this.vy;
            }
            this.jumpPressed = false;
        }
        if (this.state.type !== "rolling") {
            this.energy += 0.1;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.config.debug) {
            this.hitbox.draw(context);
        }
    }

    public setState(type: PlayerStateType, input?: InputHandler, speedMultiplier = 0): void {
        this.state = this.stateManager.get(type);
        this.game.speed = this.game.maxSpeed * speedMultiplier;
        this.state.init(input);
    }

    public jump(): void {
        if (this.onGround()) {
            this.vy = -this.maxVY;
            this._jumps++;
            this.jumpPressed = true;
        } else if (this._jumps < 2) {
            this.vy = -this.maxVY * 0.75;
            this._jumps++;
        }
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
        if (!this.onGround() && !this.noGravity) {
            this.vy += this.weight;
        } else if (this.onGround()) {
            this._jumps = 0;
        }
        this.disallowOffscreen("bottom");
    }

    private checkCollision(input: InputHandler): void {
        this.game.enemySpawner.enemies.forEach(enemy => {
            if (this.hitbox.hasCollision(enemy.hitbox)) {
                enemy.markedForDeletion = true;
                this.game.collisions.add(enemy.centerX, enemy.centerY);
                if (this.state.type === "rolling" ||
                    this.state.type === "diving" ||
                    this.state.type === "dash") {
                    this.game.score++;
                } else {
                    if (!this.game.config.immportal) {
                        this.setState("hit", input);
                    }
                }
            }
        });
    }
}