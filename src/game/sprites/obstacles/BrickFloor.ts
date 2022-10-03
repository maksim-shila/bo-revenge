import { FrameTimer, GameObject, GameObjectContainer, RectCollider } from "../../../engine";
import Game from "../../game";

const Source = {
    width: 6946,
    height: 354,
    scale: 0.2,
};
export default class BrickFloor extends GameObjectContainer {

    private readonly blockWidht = Source.width * Source.scale;
    private readonly blockHeight = Source.height * Source.scale;
    private readonly blocksCount: number;

    constructor(private game: Game) {
        super();
        this.blocksCount = Math.ceil(this.game.width / this.blockWidht) + 1;
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        for (let i = this.objects.length; i < this.blocksCount; ++i) {
            const x = i > 0 ? this.objects[i - 1].rx : 0;
            const y = this.game.height - this.blockHeight;
            const block = new BrickFloorBlock(this.game, x, y, this.blockWidht, this.blockHeight);
            this.spawn(block);
        }
    }
}

class BrickFloorBlock extends GameObject {

    private readonly image: CanvasImageSource;
    private readonly game: Game;

    constructor(game: Game, x: number, y: number, width: number, height: number,) {
        super("obstacle", x, y, width, height);
        this.game = game;
        this.image = document.getElementById("brickFloorImg") as CanvasImageSource;
        this.collider = new RectCollider(this);
    }

    public update(): void {
        if (this.rx < 0) {
            this.destroy();
        }
        this.x -= this.game.speed;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(
            this.image,
            0,
            0,
            Source.width,
            Source.height,
            this.x,
            this.y,
            this.width,
            this.height);
        if (this.game.config.debug) {
            this.collider?.draw(context);
        }
    }
}