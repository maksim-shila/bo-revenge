import { Camera, FrameTimer, Scene } from "../../../engine";
import InputHandler from "../../../input/input-handler";
import Player from "../../common/Player";
import Game from "../../game";
import ForestBackground from "./ForestBackground";
import Ground from "./obstacles/Ground";

export default class Scene2 extends Scene {

    public readonly player: Player;
    private readonly background: ForestBackground;

    constructor(game: Game, input: InputHandler) {
        super(game.width, game.height);

        this.player = new Player(game, this, input);
        this.player.x = 0;
        this.player.y = this.height - this.player.height - 200;

        this.camera = new Camera(0, 0, this.width, this.height);
        this.camera.follow(this.player);
        this.camera.deadZone.x = 0;
        this.camera.deadZone.y = 0;
        this.camera.deadZone.ry = this.height;

        this.background = new ForestBackground(this);

        for (let i = 0; i < 2; ++i) {
            this.add(new Ground(this, i * Ground.Width - i));
        }
        this.add(this.player);
    }

    public override update(frameTimer: FrameTimer): void {
        this.background.update();
        super.update(frameTimer);
    }

    public override draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        super.draw(context);
    }
}