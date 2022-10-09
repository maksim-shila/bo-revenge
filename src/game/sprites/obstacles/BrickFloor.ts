import { Animator, FrameTimer, GameObject, GameObjectContainer, Global, RectCollider, Scene } from "../../../engine";

export default class BrickFloor extends GameObjectContainer {

    private lastBlock: BrickFloorBlock | null = null;

    constructor(scene: Scene) {
        super(scene);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        while ((this.lastBlock?.rx ?? 0) < Global.window.width) {
            const block = new BrickFloorBlock(this.scene);
            block.x = this.lastBlock?.rx ?? 0;
            block.y = this.scene.height - block.height;
            this.lastBlock = block;
            this.scene.add(block);
        }
    }
}

class BrickFloorBlock extends GameObject {

    constructor(scene: Scene) {
        const source = { imageId: "brickFloorImg", width: 6946, height: 354 };
        const scale = 0.2;
        const width = Math.floor(source.width * scale);
        const height = Math.floor(source.height * scale);

        super("obstacle", scene, width, height);
        this.animator = new Animator(source.imageId, width, height, source.width, source.height);
        this.collider = new RectCollider(this);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.x += this.scene.vx;
        if (this.rx < 0) {
            this.destroy();
        }
    }
}