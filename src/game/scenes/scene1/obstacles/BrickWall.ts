import * as Bad from "bad-engine";

const Brick = new Bad.SpriteDimension("brickImg", 239, 224, 0.2);

export class BrickWallSpawner extends Bad.GameObject {

    private readonly distance = 700;
    private lastWall: BrickWall | null = null;

    constructor(scene: Bad.Scene) {
        super("brickWall", scene);
        this.lastWall = this.createWall();
        while (this.lastWall.x < this.scene.camera.rx) {
            this.spawn();
        }
    }

    public override update(): void {
        if (this.lastWall!.x < this.scene.camera.rx) {
            this.spawn();
        }
    }

    private spawn(): void {
        this.lastWall = this.createWall();
        if (Math.random() > 0.1) {
            this.createFlyWall();
        }
    }

    private createWall(): BrickWall {
        const blocksX = 2;
        const blocksY = 5;
        const x = (this.lastWall?.rx ?? 0) + this.distance;
        const y = this.scene.height - Brick.height * blocksY - 68;
        const wall = new BrickWall(this.scene, x, y, blocksX, blocksY);
        this.scene.add(wall);
        return wall;
    }

    private createFlyWall(): BrickWall {
        const blocksX = Math.floor(Math.random() * 5) + 1;
        const blocksY = Math.floor(Math.random() * 2 + 1);
        const x = (this.lastWall?.rx ?? 0) + Math.random() * 100 + 200;
        const y = Math.random() * 300 + 100;
        const wall = new BrickWall(this.scene, x, y, blocksX, blocksY);
        this.scene.add(wall, this.order);
        return wall;
    }
}

export class BrickWall extends Bad.GameObject {

    constructor(
        scene: Bad.Scene,
        x: number,
        y: number,
        private readonly blocksX: number,
        private readonly blocksY: number
    ) {
        super("obstacle", scene);
        this.name = "brick_wall";
        this.width = Brick.width * this.blocksX;
        this.height = Brick.height * this.blocksY;
        this.x = x;
        this.y = y;
        this.collider = new Bad.RectCollider(this);
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        if (this.rx < this.scene.camera.x - 50) {
            this.destroy();
        }
    }

    public override draw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.blocksX; ++i) {
            for (let j = 0; j < this.blocksY; ++j) {
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
        super.draw(context);
    }
}