import InputHandler from "./input.js";
import Player from "./player.js";

export type PlayerStateType = "standing" | "jumping" | "falling" | "running" | "sitting";
type States = { [key in PlayerStateType]: State };

export class PlayerStateManager {
    private readonly states: States;

    constructor(player: Player) {
        this.states = {} as States;
        this.states["standing"] = new Standing(player, 0, 7);
        this.states["jumping"] = new Jumping(player, 1, 7);
        this.states["falling"] = new Falling(player, 2, 7);
        this.states["running"] = new Running(player, 3, 9);
        this.states["sitting"] = new Sitting(player, 5, 5);
    }

    public get(type: PlayerStateType): State {
        return this.states[type];
    }
}

export interface State {
    init(): void;
    update(input: InputHandler): void;
}

abstract class PlayerState implements State {
    protected readonly player: Player;
    protected readonly frameY: number;
    protected readonly framesCount: number;

    constructor(player: Player, frameY: number, framesCount: number) {
        this.player = player;
        this.frameY = frameY;
        this.framesCount = framesCount;
    }

    public init(): void {
        this.player.frameY = this.frameY;
        this.player.frameX = 0;
        this.player.framesCount = this.framesCount;
    }

    public abstract update(input: InputHandler): void;

    protected allowVerticalMovement(input: InputHandler): void {
        if (input.keyPressed("left")) {
            this.player.vx = -this.player.maxVX;
        } else if (input.keyPressed("right")) {
            this.player.vx = this.player.maxVX;
        } else if (input.keyReleased("left", "right")) {
            this.player.vx = 0;
        }
    }
}

class Standing extends PlayerState {
    public override init(): void {
        super.init();
        this.player.vx = 0;
        this.player.game.speed = 0;
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (input.keyPressed("right")) {
            this.player.setState("running");
        } else if (input.keyPressed("left")) {
            this.player.setState("running");
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting");
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping");
        }
    }
}

class Jumping extends PlayerState {
    public override init(): void {
        super.init();
        this.player.game.speed = this.player.game.maxSpeed;
        if (this.player.onGround()) {
            this.player.vy = -this.player.maxVY;
        }
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (this.player.vy > this.player.weight) {
            this.player.setState("falling");
        }
    }
}

class Falling extends PlayerState {
    public override init(): void {
        super.init();
        this.player.vx = -this.player.maxVX;
        this.player.game.speed = this.player.game.maxSpeed;
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (this.player.onGround()) {
            this.player.setState("running");
        }
    }
}

class Running extends PlayerState {
    public override init(): void {
        super.init();
        this.player.game.speed = this.player.game.maxSpeed;
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (input.keyPressed("down")) {
            this.player.setState("sitting");
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping");
        }
    }
}

class Sitting extends PlayerState {
    public override init(): void {
        super.init();
        this.player.vx = 0;
        this.player.game.speed = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyReleased("down")) {
            this.player.setState("running");
        }
    }
}