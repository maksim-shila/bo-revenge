import { Animator, FrameTimer, GameObject, GameObjectContainer, RectCollider } from "../../../engine";
import Game from "../../game";

export default class BrickFloor extends GameObjectContainer {

    private readonly maxBlocksSize = 5;

    constructor(private game: Game) {
        super();
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        let lastBlock: GameObject | null = this.objects.length > 0 ? this.objects[this.objects.length - 1] : null;
        while ((lastBlock?.rx ?? 0) < this.game.width) {
            if (this.objects.length > this.maxBlocksSize) {
                throw new Error("Looks like you have infinited cycle while building BrickFloor");
            }

            const block = new BrickFloorBlock(this.game);
            block.x = lastBlock?.rx ?? 0;
            block.y = this.game.height - block.height;
            this.spawn(block);
            lastBlock = block;
        }
    }
}

const Source = { imageId: "brickFloorImg", width: 6946, height: 354 };

class BrickFloorBlock extends GameObject {

    private readonly game: Game;

    constructor(game: Game) {
        const scale = 0.2;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super("obstacle", 0, 0, width, height);
        this.game = game;

        this.animator = new Animator(Source.imageId, width, height, Source.width, Source.height);
        this.collider = new RectCollider(this);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        if (this.rx < 0) {
            this.destroy();
        }
        this.x -= this.game.speed;
    }
}