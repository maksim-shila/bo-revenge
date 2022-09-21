import { Animation } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import Player from "../player.js";
import { StateType } from "./state-type.js";

export default abstract class State {

    protected readonly game: Game;
    protected readonly animation: Animation;

    public readonly type: StateType;

    constructor(game: Game, type: StateType, animation: Animation) {
        this.game = game;
        this.type = type;
        this.animation = animation;
    }

    protected get player(): Player {
        return this.game.player;
    }

    public init(): void {
        this.animation.frameX = 0;
        this.player.animation = this.animation;
    }

    public abstract update(input: InputHandler): void;

    protected allowHorizontalMovement(input: InputHandler): void {
        if (input.keyPressed("left")) {
            this.player.vx = -this.player.vxCap;
        } else if (input.keyPressed("right")) {
            this.player.vx = this.player.vxCap;
        } else if (input.keyReleased("left") || input.keyReleased("right")) {
            this.player.vx = 0;
        }
    }
}















