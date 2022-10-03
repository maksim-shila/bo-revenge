import { Collision, FrameTimer, RigidBody } from "../engine";
import { RectCollider } from "../engine/collision/Collider";
import InputHandler from "../input/input-handler";
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

    public readonly maxVX: number;
    public readonly maxVY: number;

    private _jumps = 0;
    private _onJump = false;
    public noGravity = false;

    private readonly dashCD = 800;
    private dashTimer: NodeJS.Timeout | null = null;

    public readonly maxEnergy = 50;
    public readonly minEnergy = 10;
    private _energy = this.maxEnergy;
    private input: InputHandler;

    constructor(game: Game, input: InputHandler) {
        super("player", game, playerConfig);
        this.input = input;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.maxVX = 10;
        this.maxVY = 30;
        this.stateManager = new PlayerStateManager(this.game);
        this.collider = new RectCollider(
            this,
            p => p.x + 20,
            p => p.y + 40,
            p => p.width - 40,
            p => p.height - 40
        );
        this.rigidBody = new RigidBody(2);

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

    public update(frameTimer: FrameTimer): void {
        this.animate(frameTimer);
        this.state.update(this.input);
        this.moveX();
        this.moveY();
        if (this.input.keyReleased("jump") && this._onJump) {
            if (!this.onGround && this.vy < 0) {
                this.vy = this.vy < -5 ? -5 : this.vy;
            }
            this._onJump = false;
        }
        if (this.state.type !== "rolling") {
            this.energy += 0.1;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        if (this.game.config.debug) {
            this.collider?.draw(context);
        }
    }

    public setState(type: PlayerStateType, input?: InputHandler, speedMultiplier = 0): void {
        this.state = this.stateManager.get(type);
        this.game.speed = this.game.maxSpeed * speedMultiplier;
        this.state.init(input);
    }

    public jump(): void {
        if (this.onGround) {
            this.vy = -this.maxVY;
            this._jumps++;
            this._onJump = true;
        } else if (this._jumps < 2) {
            this.vy = -this.maxVY * 0.75;
            this._jumps++;
        }
    }

    private moveX(): void {
        this.x += this.vx;
        this.disallowOffscreen("left");
        this.disallowOffscreen("right");
    }

    private moveY(): void {
        this.y += this.vy;
        if (!this.onGround && !this.noGravity) {
            this.vy += this.weight;
        } else if (this.onGround && !this._onJump) {
            this._jumps = 0;
        }
    }

    public override onCollisionEnter(collision: Collision): void {
        const other = collision.other(this);
        if (other.type === "enemy") {
            const enemy = other;
            enemy.destroy();
            this.game.collisions.add(enemy.cx, enemy.cy);
            if (this.state.type === "rolling" ||
                this.state.type === "diving" ||
                this.state.type === "dash") {
                this.game.score++;
            } else {
                if (!this.game.config.immportal) {
                    this.setState("hit", this.input);
                }
            }
        }
    }
}