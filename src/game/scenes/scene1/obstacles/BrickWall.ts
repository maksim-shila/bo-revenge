import { FrameTimer, GameObject, GameObjectContainer, Global, RectCollider, Scene } from "../../../../engine";
import SpriteDimension from "../../../../engine/utils/SpriteDimension";

const Brick = new SpriteDimension("brickImg", 239, 224, 0.2);

export class BrickWallSpawner extends GameObjectContainer {

    private readonly distance = 700;
    private lastWall: BrickWall;

    constructor(scene: Scene) {
        super(scene);
        this.lastWall = new BrickWall(this.scene, this.distance);
        this.scene.add(this.lastWall);
        while (this.lastWall.x < this.scene.width) {
            this.lastWall = new BrickWall(this.scene, this.lastWall.rx + this.distance);
            this.scene.add(this.lastWall);
        }
    }

    public override update(): void {
        if (this.lastWall.x < this.scene.width) {
            this.lastWall = new BrickWall(this.scene, this.lastWall.rx + this.distance);
            this.scene.add(this.lastWall);
        }
    }
}

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
            this.destroy();
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
                    this.drawX + Brick.width * i,
                    this.drawY + Brick.height * j,
                    Brick.width,
                    Brick.height);
            }
        }
        if (Global.debug) {
            this.collider?.draw(context);
        }
    }
}