import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Sitting extends PlayerState {
    constructor(player: Player) {
        super("sitting", player, Animations.Sitting);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 50, 37, -65, -60), "head");
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 62, -60, -65), "body");
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.player.vx = 0;
    }

    public update(input: Bad.Input): void {
        if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD && this.player.canMoveForward) {
            this.player.setState("dash");
        } else if (input.keyUp(Actions.Down)) {
            this.player.canMoveForward ?
                this.player.setState("running") :
                this.player.setState("standing");
        } else if (input.keyDown(Actions.Roll) && this.player.canStartRoll && this.player.canMoveForward) {
            this.player.setState("rolling");
        }
    }
}