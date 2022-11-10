import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Dust from "../../particles/Dust";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Running extends PlayerState {
    constructor(player: Player) {
        super("running", player, Animations.Running);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 50, 25, -65, -60), "head");
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 50, -60, -65), "body");
    }

    public update(input: Bad.Input): void {
        this.player.scene.add(new Dust(this.player.scene, this.player.cx, this.player.y + this.player.height));
        this.allowHorizontalMovement(input);
        if (this.direction === "left" && input.keyUp(Actions.Left) || this.direction === "right" && input.keyUp(Actions.Right)) {
            this.player.setState("standing");
        } else if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD) {
            this.player.setState("dash");
        } else if (input.keyDown(Actions.Down)) {
            this.player.setState("sitting");
        } else if (input.keyDownOnce(Actions.Jump)) {
            this.player.setState("jumping");
        } else if (input.keyDown(Actions.Roll) && this.player.canStartRoll) {
            this.player.setState("rolling");
        }
    }
}