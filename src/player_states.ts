import InputHandler, { CONTROLS } from "./input.js";
import Player from "./player.js";

export enum PlayerStateType {
    STANDING = 0,
    JUMPING = 1,
    FALLING = 2,
    RUNNING = 3,
    SITTING = 5,
}

export class PlayerStateManager {
    private readonly states: State[];

    constructor(player: Player) {
        this.states = [];
        this.states[PlayerStateType.STANDING] = new Standing(player, PlayerStateType.STANDING, 7);
        this.states[PlayerStateType.JUMPING] = new Jumping(player, PlayerStateType.JUMPING, 7);
        this.states[PlayerStateType.FALLING] = new Falling(player, PlayerStateType.FALLING, 7);
        this.states[PlayerStateType.RUNNING] = new Running(player, PlayerStateType.RUNNING, 9);
        this.states[PlayerStateType.SITTING] = new Sitting(player, PlayerStateType.SITTING, 5);
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
        if (input.keyPressed(CONTROLS.LEFT)) {
            this.player.vx = -this.player.maxVX;
        } else if (input.keyPressed(CONTROLS.RIGHT)) {
            this.player.vx = this.player.maxVX;
        } else if (input.keyReleased(CONTROLS.LEFT, CONTROLS.RIGHT)) {
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
        if (input.keyPressed(CONTROLS.RIGHT)) {
            this.player.setState(PlayerStateType.RUNNING);
        } else if (input.keyPressed(CONTROLS.LEFT)) {
            this.player.setState(PlayerStateType.RUNNING);
        } else if (input.keyPressed(CONTROLS.DOWN)) {
            this.player.setState(PlayerStateType.SITTING);
        } else if (input.keyPressed(CONTROLS.JUMP)) {
            this.player.setState(PlayerStateType.JUMPING);
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
            this.player.setState(PlayerStateType.FALLING);
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
            this.player.setState(PlayerStateType.RUNNING);
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
        if (input.keyPressed(CONTROLS.DOWN)) {
            this.player.setState(PlayerStateType.SITTING);
        } else if (input.keyPressed(CONTROLS.JUMP)) {
            this.player.setState(PlayerStateType.JUMPING);
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
        if (input.keyReleased(CONTROLS.DOWN)) {
            this.player.setState(PlayerStateType.RUNNING);
        }
    }
}