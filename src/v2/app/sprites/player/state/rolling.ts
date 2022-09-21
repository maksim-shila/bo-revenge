import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Rolling extends State {
    constructor(game: Game) {
        super(game, "rolling", new AnimationRow(6, 7));
    }

    public override init(): void {
        super.init();
    }

    public update(input: InputHandler): void {
        // this.game.particles.add("fire", this.player.cx, this.player.cy);
        this.allowHorizontalMovement(input);
        if (input.keyReleased("roll") && this.player.onGround) {
            this.player.state = "running";
            this.player.speedMultiplier = 1;
        } else if (input.keyReleased("roll") && !this.player.onGround) {
            this.player.state = "falling";
            this.player.speedMultiplier = 1;
        } else if (input.keyPressed("jump")) {
            this.player.jump();
        } else if (!this.player.onGround && input.keyPressed("down")) {
            this.player.state = "diving";
            this.player.speedMultiplier = 0;
        }
    }
}