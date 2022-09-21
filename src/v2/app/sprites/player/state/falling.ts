import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Falling extends State {
    constructor(game: Game) {
        super(game, "falling", new AnimationRow(2, 7));
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (this.player.onGround) {
            this.player.state = "running";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("down")) {
            this.player.state = "diving";
            this.player.speedMultiplier = 0;
        }
    }
}