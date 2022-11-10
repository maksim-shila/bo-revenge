import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Fire from "../../particles/Fire";
import Splash from "../../particles/Splash";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Diving extends PlayerState {
    private readonly delay = 300;
    private readonly speedModifier = 1.5;

    constructor(player: Player) {
        super("diving", player, Animations.Rolling);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.noGravity = true;
        setTimeout(() => { this.player.vy = this.player.maxVY * this.speedModifier; }, this.delay);
    }

    public update(input: Bad.Input): void {
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
        if (this.player.onGround) {
            if (input.keyDown(Actions.Roll) && this.player.canStartRoll && this.player.canMoveForward) {
                this.player.setState("rolling");
            } else {
                this.player.canMoveForward ?
                    this.player.setState("running") :
                    this.player.setState("standing");
            }
            for (let i = 0; i < 30; ++i) {
                this.player.scene.add(new Splash(this.player.scene, this.player.cx, this.player.y + this.player.height));
            }
        }
    }

    public override cleanUp(): void {
        this.player.noGravity = false;
    }
}