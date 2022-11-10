import * as Bad from "bad-engine";
import { Actions } from "../../../../input/Controls";
import Fire from "../../particles/Fire";
import Player from "../../Player";
import { PlayerState, Animations } from "../PlayerState";

export class Dash extends PlayerState {

    private readonly distanceX = 200;
    private readonly distanceY = 200;
    private readonly speedX = 40;
    private readonly speedY = 40;
    private startX = 0;
    private startY = 0;

    constructor(player: Player) {
        super("dash", player, Animations.Rolling);
        this.hitbox = new Bad.Hitbox();
        this.hitbox.add(new Bad.RectCollider(this.player, 25, 35, -50, -40));
    }

    public override init(input: Bad.Input): void {
        super.init(input);
        this.player.noGravity = true;
        this.player.dashInCD = true;
        this.startX = this.player.x;
        this.startY = this.player.y;
        if (input.anyKeyDown([Actions.Up, Actions.Right, Actions.Left])) {
            if (input.keyDown(Actions.Up)) {
                this.player.vy = -this.speedY;
            } else {
                this.player.vy = 0;
            }

            if (input.keyDown(Actions.Right)) {
                this.player.vx = this.speedX;
            } else if (input.keyDown(Actions.Left)) {
                this.player.vx = -this.speedX;
            } else {
                this.player.vx = 0;
            }
        } else {
            this.player.vx = this.direction === "left" ? -this.speedX : this.speedX;
            this.player.vy = 0;
        }
    }

    public update(): void {
        this.player.scene.add(new Fire(this.player.scene, this.player.cx, this.player.cy));
        if (this.player.x > this.startX + this.distanceX ||
            this.player.x < this.startX - this.distanceX ||
            this.player.y < this.startY - this.distanceY ||
            this.player.isTouching("right", "left")
        ) {
            this.exit();
        }
    }

    public override cleanUp() {
        this.player.noGravity = false;
        this.player.vy = this.player.weight;
    }

    public override exit() {
        if (this.player.onGround) {
            this.player.setState("running");
        } else {
            this.player.setState("falling");
        }
    }
}