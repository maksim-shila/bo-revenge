import * as Bad from "bad-engine";
import Player from "../../Player";
import { Animations, PlayerState } from "../PlayerState";

export class Hit extends PlayerState {
    constructor(player: Player) {
        super("hit", player, Animations.Hit);
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(): void {
        if (!this.animation.isMaxFrame) {
            return;
        }
        if (this.player.onGround) {
            this.player.setState("running");
        } else {
            this.player.setState("falling");
        }
    }
}