import * as Bad from "bad-engine";

export default class BrickFloor extends Bad.GameObjectContainer {

    private lastBlock: BrickFloorBlock | null = null;

    constructor(scene: Bad.Scene) {
        super(scene);
    }

    public override update(frameTimer: Bad.FrameTimer): void {
        super.update(frameTimer);
        // add '+ (this.lastBlock?.width ?? 0)' to add additional offscreen platform for enemies spawn
        while ((this.lastBlock?.rx ?? 0) < this.scene.width + (this.lastBlock?.width ?? 0)) {
            const block = new BrickFloorBlock(this.scene);
            block.x = this.lastBlock?.rx ?? 0;
            block.y = this.scene.height - block.height;
            this.lastBlock = block;
            this.scene.add(block);
        }
    }
}

class BrickFloorBlock extends Bad.GameObject {

    constructor(scene: Bad.Scene) {
        const source = { imageId: "brickFloorImg", width: 6946, height: 354 };
        const scale = 0.2;
        const width = Math.floor(source.width * scale);
        const height = Math.floor(source.height * scale);

        super("obstacle", scene, width, height);
        this.animator = new Bad.Animator(source.imageId, width, height, source.width, source.height);
        this.collider = new Bad.RectCollider(this);
    }

    public override update(frameTimer: Bad.FrameTimer): void {
        super.update(frameTimer);
        this.x += this.scene.vx;
        if (this.rx < 0) {
            this.destroy();
        }
    }
}