import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Fire from "../../particles/Fire";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Rolling extends PlayerState {

    private readonly speedMultiplier = 1.7;
    private playerDefaultVX = 0;

    constructor(player: Player) {
        super("rolling", player, Animations.Rolling);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.playerDefaultVX = this.player.maxVX;
        this.player.maxVX = this.player.maxVX * this.speedMultiplier;
    }

    public update(input: Bad.Input): void {
        if (!Bad.Global.cheats.unlimitedEnergy) {
            this.player.energy -= 0.5;
        }
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
        this.allowHorizontalMovement(input);
        if (input.keyDownOnce(Actions.Dash) && !this.player.dashInCD) {
            this.player.setState("dash");
        } else if ((input.keyUp(Actions.Roll) || this.player.energy === 0) && this.player.onGround) {
            this.player.setState("running");
        } else if ((input.keyUp(Actions.Roll) || this.player.energy === 0) && !this.player.onGround) {
            this.player.setState("falling");
        } else if (input.keyDownOnce(Actions.Jump)) {
            this.player.jump();
        } else if (!this.player.onGround && input.keyDown(Actions.Down)) {
            this.player.setState("diving");
        }
    }

    public override cleanUp() {
        this.player.maxVX = this.playerDefaultVX;
    }
}