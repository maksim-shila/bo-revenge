import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Standing extends PlayerState {
    constructor(player: Player) {
        super("standing", player, Animations.Standing);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(input: Bad.Input): void {
        this.allowHorizontalMovement(input);
        if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash");
        } else if (input.keyDown(Actions.Right) && this.player.canMoveForward) {
            this.player.setState("running");
        } else if (input.keyDown(Actions.Left) && this.player.canMoveBackward) {
            this.player.setState("running");
        } else if (input.keyDown(Actions.Down)) {
            this.player.setState("sitting");
        } else if (input.keyDownOnce(Actions.Jump)) {
            this.player.setState("jumping");
        } else if (input.keyDown(Actions.Roll) && this.player.canStartRoll && this.player.canMoveForward) {
            this.player.setState("rolling");
        }
    }
}