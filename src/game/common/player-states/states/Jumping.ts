import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Player from "../../Player";
import { Animations, PlayerState } from "../PlayerState";

export class Jumping extends PlayerState {
    constructor(player: Player) {
        super("jumping", player, Animations.Jumping);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        if (this.player.jumps === 0) {
            this.player.dashInCD = false;
        }
        this.player.jump();
    }

    public update(input: Bad.Input): void {
        this.allowHorizontalMovement(input);
        if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash");
        } else if (this.player.vy > this.player.weight) {
            this.player.setState("falling");
        } else if (input.keyDown(Actions.Roll) && this.player.canStartRoll && this.player.canMoveForward) {
            this.player.setState("rolling");
        } else if (input.keyDown(Actions.Down)) {
            this.player.setState("diving");
        } else if (input.keyDownOnce(Actions.Jump)) {
            this.player.jump();
        } else if (this.player.onGround) {
            this.player.setState("running");
        }
    }
}