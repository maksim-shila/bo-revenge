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

        this.player = new Player(game, this, input);
        this.player.x = 500;
        this.player.y = this.height - this.player.height - 500;
        this.add(this.player);

        this.camera = new Bad.Camera(0, 0, this.width, this.height);
        this.camera.deadZone.x = 0;
        this.camera.deadZone.y = 0;
        this.camera.deadZone.ry = this.height;
        this.camera.follow(this.player);

        this.background = new Background(this);

        this.add(new BrickFloor(this), 0);
        this.add(new BrickWallSpawner(this), 1);
        this.add(new EnemySpawner(this.player, this), 2);

        this.soundtrack = document.getElementById("level1audio") as HTMLAudioElement;
        this.soundtrack.addEventListener("ended", () => this.soundtrack.play());
        this.soundtrack.play();
    }

    public override update(frame: Bad.Frame): void {
        this.background.update();
        super.update(frame);
        this.camera.deadZone.x = this.camera.x;
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