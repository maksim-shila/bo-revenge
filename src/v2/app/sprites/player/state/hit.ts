import { AnimationRow } from "../../../core/animation/animation.js";
import Game from "../../../game.js";
import State from "./state.js";

export default class Hit extends State {
    constructor(game: Game) {
        super(game, "hit", new AnimationRow(4, 11));
    }

    public override init(): void {
        super.init();
        this.player.vx = 0;
    }

    public update(): void {
        if (this.player.animation.isMaxFrame) {
            if (this.player.onGround) {
                this.player.state = "running";
                this.player.speedMultiplier = 1;
            } else {
                this.player.state = "falling";
                this.player.speedMultiplier = 1;
            }
        }
    }
}