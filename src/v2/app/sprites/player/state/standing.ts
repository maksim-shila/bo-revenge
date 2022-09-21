import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Standing extends State {
    constructor(game: Game) {
        super(game, "standing", new AnimationRow(0, 7));
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (input.keyPressed("right")) {
            this.player.state = "running";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("left")) {
            this.player.state = "running";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("down")) {
            this.player.state = "sitting";
            this.player.speedMultiplier = 0;
        } else if (input.keyPressed("jump")) {
            this.player.state = "jumping";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("roll")) {
            this.player.state = "rolling";
            this.player.speedMultiplier = 2;
        }
    }
}