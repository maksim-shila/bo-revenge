import { Animation, AnimationRow } from "../../core/animation/animation.js";
import Painter from "../../core/animation/painter.js";
import Collision from "../../core/collision.js";
import Dimension from "../../core/dimension.js";
import InputHandler from "../../core/input/input-handler.js";
import ScreenObject from "../../core/screen-object.js";
import Game from "../../game.js";
import StateManager from "./state/state-manager.js";
import { StateType } from "./state/state-type.js";
import State from "./state/state.js";

export default class Player extends ScreenObject {

    private readonly _game: Game;
    private readonly _painter: Painter;

    private _stateManager: StateManager;
    private _state!: State;

    private _onGround = false;
    private _speedMultiplier = 1;
    public readonly vxCap = 10;
    public readonly vyCap = 40;
    public readonly weight = 3;

    constructor(game: Game, spawnX: number, spawnY: number) {
        const dimension = new Dimension({ sw: 100.3, sh: 91.3 });

        super("player", game, spawnX, spawnY, dimension);
        this._game = game;
        this._painter = new Painter(this, "playerImg", dimension, game.globalConfig);
        this._painter.animation = new AnimationRow(3, 9);
        this._stateManager = new StateManager(this._game);
        this._state = this._stateManager.get("running");
    }

    public get onGround(): boolean {
        return this._onGround;
    }

    public set animation(value: Animation) {
        this._painter.animation = value;
    }

    public set state(value: StateType) {
        this._state = this._stateManager.get(value);
        this._state.init();
    }

    public set speedMultiplier(value: number) {
        this._game.speed = this._game.speedCap * this._speedMultiplier;
    }

    public jump(): void {
        if (this.onGround) {
            this._onGround = false;
            this.vy = -this.vyCap;
        }
    }

    public update(deltaTime: number, input: InputHandler): void {
        this._painter.update(deltaTime);
        this.moveX();
        this.checkHorizontalCollisions();
        this.moveY();
        this.checkVerticalCollisions();
        this._state.update(input);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._painter.draw(context);
    }

    private moveX(): void {
        this.x += this.vx;
        this.preventOffscreen("left");
        this.preventOffscreen("right");
    }

    private moveY(): void {
        if (!this.onGround) {
            this.vy += this.weight;
        }
        this.y += this.vy;
    }

    private checkHorizontalCollisions(): void {
        // this._game.obstacles.forEach(obstacle => {
        //     const collision = this.hitbox.collisionX(obstacle.hitbox);
        //     if (collision === "left") {
        //         this.x = obstacle.x - this.width;
        //     } else if (collision === "right") {
        //         this.x = obstacle.rx;
        //     }
        // })
    }


    private collisions: Collision[] = [];

    private checkVerticalCollisions(): void {
        this.collisions = this.collisions.filter(collision => {
            return this.hitbox.collisionY(collision.hitbox);
        });
        this._game.obstacles
            .filter(obstacle => !this.collisions.some(c => c.hitbox === obstacle.hitbox))
            .map(obstacle => this.hitbox.collisionY(obstacle.hitbox))
            .forEach(collision => {
                if (!collision) {
                    return;
                }
                if (collision.type === "top") {
                    this.y = collision.hitbox.y - this.height;
                    this.vy = 0;
                    collision.state = "standingOn";
                    this.collisions.push(collision);
                } else if (collision.type === "bottom") {
                    this.y = collision.hitbox.ry;
                }
            });
        this._onGround = this.collisions.some(c => c.state === "standingOn");
    }

}