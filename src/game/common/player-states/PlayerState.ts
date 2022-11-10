import * as Bad from "bad-engine";
import { Actions } from "../../../input/Controls";
import Player from "../Player";

export type PlayerStateType =
    "standing" |
    "jumping" |
    "falling" |
    "running" |
    "sitting" |
    "rolling" |
    "diving" |
    "hit" |
    "dash";

type Direction = "left" | "right";

export const Animations = {
    Standing: new Bad.AnimationRow(0, 7),
    Jumping: new Bad.AnimationRow(1, 7),
    Falling: new Bad.AnimationRow(2, 7),
    Running: new Bad.AnimationRow(3, 9),
    Hit: new Bad.AnimationRow(4, 11),
    Sitting: new Bad.AnimationRow(5, 5),
    Rolling: new Bad.AnimationRow(6, 7),
};

export interface State {
    type: PlayerStateType;
    direction: Direction,
    init(input?: Bad.Input): void;
    exit(input?: Bad.Input): void;
    update(input: Bad.Input): void;
}

type Animators = { [key in Direction]: Bad.Animator };

export abstract class PlayerState implements State {

    protected hitbox: Bad.Hitbox | null = null;
    private _direction: Direction = "right";
    private readonly _animators: Animators = {} as Animators;

    constructor(
        public readonly type: PlayerStateType,
        protected readonly player: Player,
        animation: Bad.Animation
    ) {
        this._animators.left = new Bad.Animator(Player.Image.leftId, Player.Image.sw, Player.Image.sh, undefined, undefined, true);
        this._animators.left.animation = animation;
        this._animators.right = new Bad.Animator(Player.Image.rightId, Player.Image.sw, Player.Image.sh, undefined, undefined, false);
        this._animators.right.animation = animation;
    }

    public get direction(): Direction {
        return this._direction;
    }

    public set direction(value: Direction) {
        if (this._direction !== value) {
            this._direction = value;
            this.player.animator = this.animator;
        }
    }

    public get animator(): Bad.Animator {
        return this._animators[this._direction];
    }

    public get animation(): Bad.Animation {
        return this.animator.animation!;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public init(input: Bad.Input): void {
        this.animation.reset();
        this.player.hitbox = this.hitbox;
        this.player.animator = this.animator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exit(input: Bad.Input): void { }

    public abstract update(input: Bad.Input): void;

    protected allowHorizontalMovement(input: Bad.Input): void {
        if (input.keyDown(Actions.Left) && this.player.canMoveBackward) {
            this.player.vx = -this.player.maxVX;
            this.direction = "left";
        } else if (input.keyDown(Actions.Right) && this.player.canMoveForward) {
            this.player.vx = this.player.maxVX;
            this.direction = "right";
        } else if (input.keyUp(Actions.Left) || input.keyUp(Actions.Right)) {
            this.player.vx = 0;
        }
    }
}
