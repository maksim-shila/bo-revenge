import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Sitting extends State {
    constructor(game: Game) {
        super(game, "sitting", new AnimationRow(5, 5));
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(input: InputHandler): void {
        if (input.keyReleased("down")) {
            this.player.state = "running";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("roll")) {
            this.player.state = "rolling";
            this.player.speedMultiplier = 2;
        }
    }
}