import { AnimationRow } from "../../../core/animation/animation.js";
import InputHandler from "../../../core/input/input-handler.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Diving extends State {

    constructor(game: Game) {
        super(game, "diving", new AnimationRow(6, 7));
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
        this.player.vy = 15;
    }

    public update(input: InputHandler): void {
        // this.game.particles.add("fire", this.player.centerX, this.player.centerY);
        if (this.player.onGround) {
            if (input.keyPressed("roll")) {
                this.player.state = "rolling";
                this.player.speedMultiplier = 2;
            } else {
                this.player.state = "running";
                this.player.speedMultiplier = 1;
            }
            // for (let i = 0; i < 30; ++i) {
            //     this.game.particles.add("splash", this.player.centerX, this.player.y + this.player.height);
            // }
        }
    }
}