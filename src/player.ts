import Sprite, { SpriteConfig } from "./core/sprite.js";
import Game from "./game.js";
import InputHandler from "./input.js";
import { PlayerStateManager, PlayerStateType, State } from "./player_states.js";

const spriteConfig: SpriteConfig = {
    imageId: "playerImg",
    width: 100.3,
    height: 91.3,
    x: 0,
    y: 0
};

export default class Player extends Sprite {

    public stateManager: PlayerStateManager;
    public state: State;

    public readonly maxVX: number = 10;
    public readonly maxVY: number = 30;
    public readonly weight: number = 2;

    constructor(game: Game) {
        super(game, spriteConfig);
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.stateManager = new PlayerStateManager(this);
        this.state = this.stateManager.get("running");
        this.state.init();
    }

    public override update(input: InputHandler, deltaTime: number): void {
        super.update(input, deltaTime);
        this.state.update(input);
        this.moveX();
        this.moveY();
    }

    public setState(type: PlayerStateType): void {
        this.state = this.stateManager.get(type);
        this.state.init();
    }

    private moveX(): void {
        this.x += this.vx;
        this.disallowOffscreen("left");
        this.disallowOffscreen("right");
    }

    private moveY(): void {
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        }
        this.disallowOffscreen("bottom");
    }

    public onGround(): boolean {
        return this.isTouching("bottom");
    }
}