import * as Bad from "bad-engine";
import InputHandler from "../../input/input-handler";
import Dust from "./particles/Dust";
import Fire from "./particles/Fire";
import Splash from "./particles/Splash";
import Player from "./Player";

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
    Standing: new Bad.AnimationRow(0, 7),
    Jumping: new Bad.AnimationRow(1, 7),
    Falling: new Bad.AnimationRow(2, 7),
    Running: new Bad.AnimationRow(3, 9),
    Hit: new Bad.AnimationRow(4, 11),
    Sitting: new Bad.AnimationRow(5, 5),
    Rolling: new Bad.AnimationRow(6, 7),
};
export class PlayerStateManager {
    private readonly states: States;

    constructor(player: Player) {
        this.states = {} as States;
        this.states["standing"] = new Standing(player);
        this.states["jumping"] = new Jumping(player);
        this.states["falling"] = new Falling(player);
        this.states["running"] = new Running(player);
        this.states["sitting"] = new Sitting(player);
        this.states["rolling"] = new Rolling(player);
        this.states["diving"] = new Diving(player);
        this.states["hit"] = new Hit(player);
        this.states["dash"] = new Dash(player);
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
        public readonly type: PlayerStateType,
        protected readonly player: Player,
        protected readonly animation: Bad.Animation
    ) { }

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
        if (input.keyPressed("left") && this.player.canMoveBackward) {
            this.player.vx = -this.player.maxVX;
        } else if (input.keyPressed("right") && this.player.canMoveForward) {
            this.player.vx = this.player.maxVX;
        } else if (input.keyReleased("left") || input.keyReleased("right")) {
            this.player.vx = 0;
        }
    }
}

class Standing extends PlayerState {
    constructor(player: Player) {
        super("standing", player, Animations.Standing);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");

        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash", input, 1);
        } else if (input.keyPressed("right") && this.player.canMoveForward) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("left") && this.player.canMoveBackward) {
            this.player.setState("running", input, 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.setState("jumping", input, this.player.canMoveForward ? 1 : 0);
        } else if (input.keyPressed("roll") && this.player.canStartRoll && this.player.canMoveForward) {
            this.player.setState("rolling", input, 2);
        }
    }
}

class Jumping extends PlayerState {
    constructor(player: Player) {
        super("jumping", player, Animations.Jumping);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");

        if (this.player.jumps === 0) {
            this.player.dashInCD = false;
        }
        this.player.jump();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash", input, 1);
        } else if (this.player.vy > this.player.weight) {
            this.player.setState("falling", input, this.player.canMoveForward ? 1 : 0);
        } else if (input.keyPressed("roll") && this.player.canStartRoll && this.player.canMoveForward) {
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
    constructor(player: Player) {
        super("falling", player, Animations.Falling);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressedOnce("dash") && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash", input, 1);
        } else if (this.player.onGround) {
            this.player.canMoveForward ?
                this.player.setState("running", input, 1) :
                this.player.setState("standing", input, 0);
        } else if (input.keyPressed("down")) {
            this.player.setState("diving", input, 0);
        } else if (input.keyPressedOnce("jump")) {
            this.player.setState("jumping", input, this.player.canMoveForward ? 1 : 0);
        }
    }
}

class Running extends PlayerState {
    constructor(player: Player) {
        super("running", player, Animations.Running);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public update(input: InputHandler): void {
        this.player.scene.add(new Dust(this.player.scene, this.player.cx, this.player.y + this.player.height));
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
    constructor(player: Player) {
        super("sitting", player, Animations.Sitting);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 50, 37, -65, -60), "head");
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 62, -60, -65), "body");

        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyPressedOnce("dash") && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash", input, 1);
        } else if (input.keyReleased("down")) {
            this.player.canMoveForward ?
                this.player.setState("running", input, 1) :
                this.player.setState("standing", input, 0);
        } else if (input.keyPressed("roll") && this.player.canStartRoll && this.player.canMoveForward) {
            this.player.setState("rolling", input, 2);
        }
    }
}

class Rolling extends PlayerState {
    constructor(player: Player) {
        super("rolling", player, Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));
    }

    public update(input: InputHandler): void {
        if (!Bad.Global.cheats.unlimitedEnergy) {
            this.player.energy -= 0.5;
        }
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
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
    constructor(player: Player) {
        super("diving", player, Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));

        this.player.vx = 0;
        this.player.vy = 15;
    }

    public update(input: InputHandler): void {
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
        if (this.player.onGround) {
            if (input.keyPressed("roll") && this.player.canStartRoll && this.player.canMoveForward) {
                this.player.setState("rolling", input, 2);
            } else {
                this.player.canMoveForward ?
                    this.player.setState("running", input, 1) :
                    this.player.setState("standing", input, 0);
            }
            for (let i = 0; i < 30; ++i) {
                this.player.scene.add(new Splash(this.player.scene, this.player.cx, this.player.y + this.player.height));
            }
        }
    }
}

class Hit extends PlayerState {
    constructor(player: Player) {
        super("hit", player, Animations.Hit);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = null;
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

    constructor(player: Player) {
        super("dash", player, Animations.Rolling);
    }

    public override init(input: InputHandler): void {
        super.init(input);

        this.player.hitbox = new Bad.Hitbox();
        this.player.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));

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
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
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