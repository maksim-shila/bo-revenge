import { FrameTimer, GameObject, Global, RectCollider } from "../../../engine";
import Game from "../../game";

export class BrickWall extends GameObject {

    private readonly brickSw = 239;
    private readonly brickSh = 224;
    private readonly scale = 0.2;
    private readonly brickWidth = Math.ceil(this.brickSw * this.scale);
    private readonly brickHeight = Math.ceil(this.brickSh * this.scale);
    private readonly brickImage = document.getElementById("brickImg") as CanvasImageSource;

    private readonly wallWidht = 2;
    private readonly wallHeight = 5;

    constructor(private readonly game: Game, x: number) {
        super("obstacle", x);
        this.name = "brick_wall";
        this.width = this.brickWidth * this.wallWidht;
        this.height = this.brickHeight * this.wallHeight;
        this.y = this.game.height - this.height - 70;
        this.collider = new RectCollider(this);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.vx = -this.game.speed;
        if (this.rx < -50) {
            this.x = this.game.width + 100;
        } else {
            this.x += this.vx;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.wallWidht; ++i) {
            for (let j = 0; j < this.wallHeight; ++j) {
                context.drawImage(
                    this.brickImage,
                    0,
                    0,
                    this.brickSw,
                    this.brickSh,
                    this.x + this.brickWidth * i,
                    this.y + this.brickHeight * j,
                    this.brickWidth,
                    this.brickHeight);
            }
        }
        if (Global.debug) {
            this.collider?.draw(context);
        }
    }
}