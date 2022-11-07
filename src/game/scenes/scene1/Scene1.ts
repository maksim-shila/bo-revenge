import * as Bad from "bad-engine";
import Background from "./background";
import Game from "../../game";
import EnemySpawner from "./enemies/EnemySpawner";
import BrickFloor from "./obstacles/BrickFloor";
import { BrickWallSpawner } from "./obstacles/BrickWall";
import Player from "../../common/Player";

export default class Scene1 extends Bad.Scene {

    public readonly player: Player;

    private readonly background: Background;
    private readonly soundtrack: HTMLAudioElement;

    constructor(game: Game, input: () => Bad.Input) {
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

    public override update(frame: Bad.Frame): void {
        this.background.update();
        super.update(frame);
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