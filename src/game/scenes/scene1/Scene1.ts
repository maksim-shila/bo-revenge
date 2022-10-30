import { FrameTimer, Scene } from "bad-engine";
import InputHandler from "../../../input/input-handler";
import Background from "./background";
import Game from "../../game";
import EnemySpawner from "./enemies/EnemySpawner";
import BrickFloor from "./obstacles/BrickFloor";
import { BrickWallSpawner } from "./obstacles/BrickWall";
import Player from "../../common/Player";

export default class Scene1 extends Scene {

    public readonly player: Player;

    private readonly background: Background;
    private readonly soundtrack: HTMLAudioElement;

    constructor(game: Game, input: InputHandler) {
        super(game.width, game.height);

        this.vx_default = -3;
        this.vx = this.vx_default;

        this.player = new Player(game, this, input);
        this.player.x = 0;
        this.player.y = this.height - this.player.height - 200;
        this.add(this.player);

        this.add(new BrickFloor(this));
        this.add(new BrickWallSpawner(this));
        this.add(new EnemySpawner(this.player, this));

        this.background = new Background(this);

        this.soundtrack = document.getElementById("level1audio") as HTMLAudioElement;
        this.soundtrack.addEventListener("ended", () => this.soundtrack.play());
        this.soundtrack.play();
    }

    public override update(frameTimer: FrameTimer): void {
        this.background.update();
        super.update(frameTimer);
    }

    public override draw(context: CanvasRenderingContext2D): void {
        this.background.draw(context);
        super.draw(context);
    }

    public override destroy(): void {
        super.destroy();
        this.soundtrack.pause();
        this.soundtrack.currentTime = 0;
    }
}