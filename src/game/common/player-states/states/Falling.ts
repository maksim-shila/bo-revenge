import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Falling extends PlayerState {
    constructor(player: Player) {
        super("falling", player, Animations.Falling);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public update(input: Bad.Input): void {
        this.allowHorizontalMovement(input);
        if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash");
        } else if (this.player.onGround) {
            this.player.canMoveForward ?
                this.player.setState("running") :
                this.player.setState("standing");
        } else if (input.keyDown(Actions.Down)) {
            this.player.setState("diving");
        } else if (input.keyDownOnce(Actions.Jump)) {
            this.player.setState("jumping");
        }
    }
}