import * as Bad from "bad-engine";
import Game from "../game";
import { Enemy } from "../scenes/scene1/enemies/Enemy";
import { Actions } from "../../input/Controls";
import { State, PlayerStateType } from "./player-states/PlayerState";
import { PlayerStateManager } from "./player-states/PlayerStateManager";

export default class Player extends Bad.GameObject {

    public static Image = {
        leftId: "playerLeftImg",
        rightId: "playerRightImg",
        sw: 100.3,
        sh: 91.3
    };

    public stateManager: PlayerStateManager;
    public state: State;

    public maxVX = 8;
    public maxVY = 30;

    private _jumps = 0;
    private _onJump = false;
    public noGravity = false;

    private readonly dashCD = 800;
    private dashTimer: NodeJS.Timeout | null = null;

    public readonly maxEnergy = 50;
    public readonly minEnergy = 10;
    private _energy = this.maxEnergy;

    public canMoveBackward = true;
    public canMoveForward = true;
    private readonly input: () => Bad.Input;

    constructor(private readonly game: Game, scene: Bad.Scene, input: () => Bad.Input) {
        super("player", scene, Player.Image.sw, Player.Image.sh);
        this.input = input;
        this.collider = new Bad.RectCollider(this, 10, 10, -20, -10);
        this.rigidBody = new Bad.RigidBody(2);
        this.stateManager = new PlayerStateManager(this);
        this.state = this.stateManager.get("standing");
        this.state.init();
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

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        this.state.update(this.input());

        if (!this.onGround && !this.noGravity && this.vy < this.maxVY) {
            this.vy += this.weight;
        } else if (this.onGround && !this._onJump) {
            this._jumps = 0;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.disallowOffscreen("left");
        this.disallowOffscreen("right");
        if (this.isOffscreen(["bottom"])) {
            this.x = 0;
            this.y = 100;
        }

        if (this.input().keyUp(Actions.Jump) && this._onJump && this.state.type !== "dash") {
            if (!this.onGround && this.vy < 0) {
                this.vy = this.vy < -5 ? -5 : this.vy;
            }
            this._onJump = false;
        }
        if (this.state.type !== "rolling") {
            this.energy += 0.1;
        }
    }

    public setState(type: PlayerStateType): void {
        const direction = this.state.direction;
        this.state.cleanUp();
        this.state = this.stateManager.get(type);
        this.state.direction = direction;
        this.state.init(this.input());
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

    public override onCollision(collision: Bad.Collision): void {
        const other = collision.other(this);
        if (other.type === "enemy") {
            const enemy = other as Enemy;
            if (this.hitbox?.hasCollision(enemy.hitbox)) {
                enemy.die();
                if (this.state.type === "rolling" ||
                    this.state.type === "diving" ||
                    this.state.type === "dash") {
                    this.game.score++;
                } else {
                    if (!Bad.Global.cheats.immortal) {
                        this.setState("hit");
                    }
                }
            }
        }
    }

    public override onObstacleCollisions(directions: Bad.CollisionDirection[]): void {
        if (this.state.type === "dash" && (directions.includes("right") || directions.includes("left"))) {
            this.state.exit(this.input());
        }
        if (directions.includes("right")) {
            this.canMoveForward = false;
            if (!["standing", "jumping", "falling", "sitting", "diving"].includes(this.state.type) && !this._onJump) {
                this.setState("standing");
            }
        } else {
            this.canMoveForward = true;
        }
        if (this.isTouching("left") && this.state.type === "standing") {
            this.canMoveBackward = false;
        } else {
            this.canMoveBackward = true;
        }
    }
}