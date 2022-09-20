import Game from "./game.js";
import InputHandler from "../input.js";
import Player from "./player.js";

export type PlayerStateType = "standing" | "jumping" | "falling" | "running" | "sitting" | "rolling" | "diving" | "hit";
type States = { [key in PlayerStateType]: State };

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
    }

    public get(type: PlayerStateType): State {
        return this.states[type];
    }
}

export interface State {
    type: PlayerStateType;
    init(): void;
    update(input: InputHandler): void;
}

abstract class PlayerState implements State {

    protected readonly game: Game;
    protected readonly frameY: number;
    protected readonly framesCount: number;

    public readonly type: PlayerStateType;

    constructor(game: Game, type: PlayerStateType, { frameY, framesCount }: { frameY: number; framesCount: number; }) {
        this.game = game;
        this.type = type;
        this.frameY = frameY;
        this.framesCount = framesCount;
    }

    protected get player(): Player {
        return this.game.player;
    }

    public init(): void {
        this.player.frameY = this.frameY;
        this.player.frameX = 0;
        this.player.framesCount = this.framesCount;
    }

    public abstract update(input: InputHandler): void;

    protected allowHorizontalMovement(input: InputHandler): void {
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
    constructor(game: Game) {
        super(game, "standing", { frameY: 0, framesCount: 7 });
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressed("right")) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("left")) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("sitting", 0);
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping", 1);
        } else if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        }
    }
}

class Jumping extends PlayerState {
    constructor(game: Game) {
        super(game, "jumping", { frameY: 1, framesCount: 7 });
    }

    public override init(): void {
        super.init();
        this.player.jump();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (this.player.vy > this.player.weight) {
            this.player.setState("falling", 1);
        } else if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        } else if (input.keyPressed("down")) {
            this.player.setState("diving", 0);
        }
    }
}

class Falling extends PlayerState {
    constructor(game: Game) {
        super(game, "falling", { frameY: 2, framesCount: 7 });
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (this.player.onGround()) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("down")) {
            this.player.setState("diving", 0);
        }
    }
}

class Running extends PlayerState {
    constructor(game: Game) {
        super(game, "running", { frameY: 3, framesCount: 9 });
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.game.particles.add("dust", this.player.centerX, this.player.y + this.player.height);
        this.allowHorizontalMovement(input);
        if (input.keyPressed("down")) {
            this.player.setState("sitting", 0);
        } else if (input.keyPressed("jump")) {
            this.player.setState("jumping", 1);
        } else if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        } else if (!this.player.onGround()) {
            this.player.setState("falling", 1);
        }
    }
}

class Sitting extends PlayerState {
    constructor(game: Game) {
        super(game, "sitting", { frameY: 5, framesCount: 5 });
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyReleased("down")) {
            this.player.setState("running", 1);
        } else if (input.keyPressed("roll")) {
            this.player.setState("rolling", 2);
        }
    }
}

class Rolling extends PlayerState {
    constructor(game: Game) {
        super(game, "rolling", { frameY: 6, framesCount: 7 });
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.game.particles.add("fire", this.player.centerX, this.player.centerY);
        this.allowHorizontalMovement(input);
        if (input.keyReleased("roll") && this.player.onGround()) {
            this.player.setState("running", 1);
        } else if (input.keyReleased("roll") && !this.player.onGround()) {
            this.player.setState("falling", 1);
        } else if (input.keyPressed("jump")) {
            this.player.jump();
        } else if (!this.player.onGround() && input.keyPressed("down")) {
            this.player.setState("diving", 0);
        }
    }
}

class Diving extends PlayerState {
    constructor(game: Game) {
        super(game, "diving", { frameY: 6, framesCount: 7 });
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
        this.player.vy = 15;
    }

    public update(input: InputHandler): void {
        this.game.particles.add("fire", this.player.centerX, this.player.centerY);
        if (this.player.onGround()) {
            if (input.keyPressed("roll")) {
                this.player.setState("rolling", 2);
            } else {
                this.player.setState("running", 1);
            }
            for (let i = 0; i < 30; ++i) {
                this.game.particles.add("splash", this.player.centerX, this.player.y + this.player.height);
            }
        }
    }
}

class Hit extends PlayerState {
    constructor(game: Game) {
        super(game, "hit", { frameY: 4, framesCount: 11 });
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(): void {
        if (this.player.isMaxFrame()) {
            if (this.player.onGround()) {
                this.player.setState("running", 1);
            } else {
                this.player.setState("falling", 1);
            }
        }
    }
}