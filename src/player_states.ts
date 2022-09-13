import InputHandler from "./input.js";
import Player from "./player.js";

export type PlayerStateType = "standing" | "jumping" | "falling" | "running" | "sitting" | "rolling";
type States = { [key in PlayerStateType]: State };

export class PlayerStateManager {
    private readonly states: States;

    constructor(player: Player) {
        this.states = {} as States;
        this.states["standing"] = new Standing({ player, frameY: 0, framesCount: 7 });
        this.states["jumping"] = new Jumping({ player, frameY: 1, framesCount: 7 });
        this.states["falling"] = new Falling({ player, frameY: 2, framesCount: 7 });
        this.states["running"] = new Running({ player, frameY: 3, framesCount: 9 });
        this.states["sitting"] = new Sitting({ player, frameY: 5, framesCount: 5 });
        this.states["rolling"] = new Rolling({ player, frameY: 6, framesCount: 7 });
    }

    public get(type: PlayerStateType): State {
        return this.states[type];
    }
}

export interface State {
    init(): void;
    update(input: InputHandler): void;
}

type PlayerStateParams = {
    player: Player;
    frameY: number;
    framesCount: number;
}
abstract class PlayerState implements State {
    protected readonly player: Player;
    protected readonly frameY: number;
    protected readonly framesCount: number;

    constructor({ player, frameY, framesCount }: PlayerStateParams) {
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
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (input.keyPressed("right")) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("left")) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting", 0);
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping", 1);
        }
    }
}

class Jumping extends PlayerState {
    public override init(): void {
        super.init();
        if (this.player.onGround()) {
            this.player.vy = -this.player.maxVY;
        }
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        }
        if (this.player.vy > this.player.weight) {
            this.player.setState("falling", 1);
        }
    }
}

class Falling extends PlayerState {
    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (this.player.onGround()) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        }
    }
}

class Running extends PlayerState {
    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (input.keyPressed("down")) {
            this.player.setState("sitting", 0);
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping", 1);
        }
    }
}

class Sitting extends PlayerState {
    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyReleased("down")) {
            this.player.setState("running", 1);
        }
    }
}

class Rolling extends PlayerState {
    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.allowVerticalMovement(input);
        if (this.player.onGround()) {
            this.player.setState("running", 1);
        }
    }
}