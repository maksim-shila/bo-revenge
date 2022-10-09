import { FrameTimer, GameObject, Global, RectCollider, Scene } from "../../../engine";
import SpriteDimension from "../../../engine/utils/SpriteDimension";

const Brick = new SpriteDimension("brickImg", 239, 224, 0.2);

export class BrickWall extends GameObject {

    private readonly wallWidht = 2;
    private readonly wallHeight = 5;

    constructor(scene: Scene, x: number) {
        super("obstacle", scene);
        this.name = "brick_wall";
        this.width = Brick.width * this.wallWidht;
        this.height = Brick.height * this.wallHeight;
        this.x = x;
        this.y = this.scene.height - this.height - 70;
        this.collider = new RectCollider(this);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.x += this.scene.vx;
        if (this.rx < -50) {
            this.x = this.scene.width + 200;
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.wallWidht; ++i) {
            for (let j = 0; j < this.wallHeight; ++j) {
                context.drawImage(
                    Brick.image,
                    0,
                    0,
                    Brick.sw,
                    Brick.sh,
                    this.x + Brick.width * i,
                    this.y + Brick.height * j,
                    Brick.width,
                    Brick.height);
            }
        }
        if (Global.debug) {
            this.collider?.draw(context);
        }
    }
}