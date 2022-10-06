import { Animation, AnimationRow, Global } from "../engine";
import InputHandler from "../input/input-handler";
import Game from "./game";
import Player from "./player";

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
type States = { [key in PlayerStateType]: State };

const Animations = {
    Standing: new AnimationRow(0, 7),
    Jumping: new AnimationRow(1, 7),
    Falling: new AnimationRow(2, 7),
    Running: new AnimationRow(3, 9),
    Hit: new AnimationRow(4, 11),
    Sitting: new AnimationRow(5, 5),
    Rolling: new AnimationRow(6, 7),
};
export class PlayerStateManager {
    private readonly states: States;

    constructor(game: Game) {
        this.states = {} as States;
        this.states["standing"] = new Standing(game);
        this.states["jumping"] = new Jumping(game);
        this.states["falling"] = new Falling(game);
        this.states["running"] = new Running(game);
        this.states["sitting"] = new Sitting(game);
        this.states["rolling"] = new Rolling(game);
        this.states["diving"] = new Diving(game);
        this.states["hit"] = new Hit(game);
        this.states["dash"] = new Dash(game);
    }

    public get(type: PlayerStateType): State {
        return this.states[type];
    }
}

export interface State {
    type: PlayerStateType;
    init(input?: InputHandler): void;
    exit(input?: InputHandler): void;
    update(input: InputHandler): void;
}

abstract class PlayerState implements State {

    constructor(
        protected readonly game: Game,
        public readonly type: PlayerStateType,
        protected readonly animation: Animation
    ) { }

    protected get player(): Player {
        return this.game.player;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public init(input: InputHandler): void {
        if (this.player.animator) {
            this.animation.reset();
            this.player.animator.animation = this.animation;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exit(input: InputHandler): void { }

    public abstract update(input: InputHandler): void;

    protected allowHorizontalMovement(input: InputHandler): void {
        if (input.keyPressed("left")) {
            this.player.vx = -this.player.maxVX;
        } else if (input.keyPressed("right") && this.player.canMoveForward) {
            this.player.vx = this.player.maxVX;
        } else if (input.keyReleased("left") || input.keyReleased("right")) {
            this.player.vx = 0;
        }
    }
}

class Standing extends PlayerState {
    constructor(game: Game) {
        super(game, "standing", Animations.Standing);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if (input.keyPressed("right") && this.player.canMoveForward) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("left")) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.setState("jumping", input, 1);
        } else if (input.keyPressed("roll") && this.player.canStartRoll) {
            this.player.setState("rolling", input, 2);
        }
    }
}

class Jumping extends PlayerState {
    constructor(game: Game) {
        super(game, "jumping", Animations.Jumping);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        if (this.player.jumps === 0) {
            this.player.dashInCD = false;
        }
        this.player.jump();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if (this.player.vy > this.player.weight) {
            this.player.setState("falling", input, 1);
        } else if (input.keyPressed("roll") && this.player.canStartRoll) {
            this.player.setState("rolling", input, 2);
        } else if (input.keyPressed("down")) {
            this.player.setState("diving", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.jump();
        } else if (this.player.onGround) {
            this.player.setState("running", input, 1);
        }
    }
}

class Falling extends PlayerState {
    constructor(game: Game) {
        super(game, "falling", Animations.Falling);
    }

    public override init(input: InputHandler): void {
        super.init(input);
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if (this.player.onGround) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("diving", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.setState("jumping", input, 1);
        }
    }
}

class Running extends PlayerState {
    constructor(game: Game) {
        super(game, "running", Animations.Running);
    }

    public override init(input: InputHandler): void {
        super.init(input);
    }

    public update(input: InputHandler): void {
        this.game.particles.add("dust", this.player.cx, this.player.y + this.player.height);
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.setState("jumping", input, 1);
        } else if (input.keyPressed("roll") && this.player.canStartRoll) {
            this.player.setState("rolling", input, 2);
        }
    }
}

class Sitting extends PlayerState {
    constructor(game: Game) {
        super(game, "sitting", Animations.Sitting);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if (input.keyReleased("down")) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("roll") && this.player.canStartRoll) {
            this.player.setState("rolling", input, 2);
        }
    }
}

class Rolling extends PlayerState {
    constructor(game: Game) {
        super(game, "rolling", Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);
    }

    public update(input: InputHandler): void {
        if (!Global.cheats.unlimitedEnergy) {
            this.player.energy -= 0.5;
        }
        this.game.particles.add("fire", this.player.cx, this.player.cy);
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD) {
            this.player.setState("dash", input, 1);
        } else if ((input.keyReleased("roll") || this.player.energy === 0) && this.player.onGround) {
            this.player.setState("running", input, 1);
        } else if ((input.keyReleased("roll") || this.player.energy === 0) && !this.player.onGround) {
            this.player.setState("falling", input, 1);
        } else if (input.keyPressedOnce("jump")) {
            this.player.jump();
        } else if (!this.player.onGround && input.keyPressed("down")) {
            this.player.setState("diving", input, 0);
        }
    }
}

class Diving extends PlayerState {
    constructor(game: Game) {
        super(game, "diving", Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        this.player.vx = 0;
        this.player.vy = 15;
    }

    public update(input: InputHandler): void {
        this.game.particles.add("fire", this.player.cx, this.player.cy);
        if (this.player.onGround) {
            if (input.keyPressed("roll") && this.player.canStartRoll) {
                this.player.setState("rolling", input, 2);
            } else {
                this.player.setState("running", input, 1);
            }
            for (let i = 0; i < 30; ++i) {
                this.game.particles.add("splash", this.player.cx, this.player.y + this.player.height);
            }
        }
    }
}

class Hit extends PlayerState {
    constructor(game: Game) {
        super(game, "hit", Animations.Hit);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (this.animation.isMaxFrame) {
            if (this.player.onGround) {
                this.player.setState("running", input, 1);
            } else {
                this.player.setState("falling", input, 1);
            }
        }
    }
}

class Dash extends PlayerState {

    private readonly distanceX = 200;
    private readonly distanceY = 200;
    private readonly speedX = 40;
    private readonly speedY = 40;
    private startX = 0;
    private startY = 0;

    constructor(game: Game) {
        super(game, "dash", Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);
        if (!input) {
            return;
        }

        this.player.noGravity = true;
        this.player.dashInCD = true;
        this.startX = this.player.x;
        this.startY = this.player.y;
        if (input.keyPressed("up") || input.keyPressed("right") || input.keyPressed("left")) {
            if (input.keyPressed("up")) {
                this.player.vy = -this.speedY;
            } else {
                this.player.vy = 0;
            }

            if (input.keyPressed("right")) {
                this.player.vx = this.speedX;
            } else if (input.keyPressed("left")) {
                this.player.vx = -this.speedX;
            } else {
                this.player.vx = 0;
            }
        } else {
            this.player.vx = this.speedX;
            this.player.vy = 0;
        }
    }

    public update(input: InputHandler): void {
        this.game.particles.add("fire", this.player.cx, this.player.cy);
        if (this.player.x > this.startX + this.distanceX ||
            this.player.x < this.startX - this.distanceX ||
            this.player.y < this.startY - this.distanceY ||
            this.player.isTouching("right", "left")
        ) {
            this.exit(input);
        }
    }

    public override exit(input: InputHandler) {
        this.player.noGravity = false;
        this.player.vy = this.player.weight;
        if (this.player.onGround) {
            this.player.setState("running", input, 1);
        } else {
            this.player.setState("falling", input, 1);
        }
    }
}