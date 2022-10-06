import { Animator, Collision, CollisionDirection, FrameTimer, Global, RigidBody } from "../engine";
import { RectCollider } from "../engine/collision/Collider";
import InputHandler from "../input/input-handler";
import Sprite from "./core/sprite";
import Game from "./game";
import { PlayerStateManager, PlayerStateType, State } from "./playerStates";

const Source = { image: "playerImg", widht: 100.3, height: 91.3 };

export default class Player extends Sprite {

    public stateManager: PlayerStateManager;
    public state!: State; // Initialized on Game class constructor

    public readonly maxVX = 10;
    public readonly maxVY = 30;

    private _jumps = 0;
    private _onJump = false;
    public noGravity = false;

    private readonly dashCD = 800;
    private dashTimer: NodeJS.Timeout | null = null;

    public readonly maxEnergy = 50;
    public readonly minEnergy = 10;
    private _energy = this.maxEnergy;

    public canMoveForward = true;
    private readonly input: InputHandler;

    constructor(game: Game, input: InputHandler) {
        super("player", game, Source.widht, Source.height);
        this.input = input;
        this.stateManager = new PlayerStateManager(this.game);
        this.collider = new RectCollider(this, 10, 10, -20, -10);
        this.rigidBody = new RigidBody(2);
        this.animator = new Animator(Source.image, Source.widht, Source.height);

        this.x = 0;
        this.y = this.game.height - this.height - 200;
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

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
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
        if (this.isOffscreen("left", "right", "bottom")) {
            this.x = 0;
            this.y = 100;
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
                if (!Global.cheats.immportal) {
                    this.setState("hit", this.input);
                }
            }
        }
    }

    public override onObstacleCollisions(directions: CollisionDirection[]): void {
        if (this.state.type === "dash" && (directions.includes("right") || directions.includes("left"))) {
            this.state.exit(this.input);
        }
        if (directions.includes("right")) {
            this.canMoveForward = false;
            if (this.state.type !== "standing") {
                this.setState("standing", this.input, 0);
            }
        } else {
            this.canMoveForward = true;
        }
    }
}