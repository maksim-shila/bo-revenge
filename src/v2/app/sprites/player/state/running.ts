import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Running extends State {
    constructor(game: Game) {
        super(game, "running", new AnimationRow(3, 9));
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        // this.game.particles.add("dust", this.player.cx, this.player.y + this.player.height);
        this.allowHorizontalMovement(input);
        if (input.keyPressed("down")) {
            this.player.state = "sitting";
            this.player.speedMultiplier = 0;
        } else if (input.keyPressed("jump")) {
            this.player.state = "jumping";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("roll")) {
            this.player.state = "rolling";
            this.player.speedMultiplier = 2;
        } else if (!this.player.onGround) {
            this.player.state = "falling";
            this.player.speedMultiplier = 1;
        }
    }
}