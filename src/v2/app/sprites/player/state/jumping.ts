import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Jumping extends State {
    constructor(game: Game) {
        super(game, "jumping", new AnimationRow(1, 7));
    }

    public override init(): void {
        super.init();
        this.player.jump();
    }

    public update(input: InputHandler): void {
        this.allowHorizontalMovement(input);
        if (this.player.vy > this.player.weight) {
            this.player.state = "falling";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("roll")) {
            this.player.state = "rolling";
            this.player.speedMultiplier = 2;
        } else if (input.keyPressed("down")) {
            this.player.state = "diving";
            this.player.speedMultiplier = 0;
        }
    }
}