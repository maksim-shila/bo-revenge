import Sprite, { SpriteConfig } from "./common/sprite.js";
import Game from "./game.js";
import InputHandler, { CONTROLS } from "./input.js";

const spriteConfig: SpriteConfig = {
    imageId: "playerImg",
    width: 100,
    height: 91.3,
    x: 0,
    y: 0
};

export default class Player extends Sprite {

    private vx: number;
    private vy: number;

    private readonly maxVX: number = 10;
    private readonly maxVY: number = 30;
    private readonly weight: number = 2;

    constructor(game: Game) {
        super(game, spriteConfig);
        this.y = this.game.height - this.height;
        this.vx = 0;
        this.vy = 0;
    }

    public update(input: InputHandler): void {
        this.moveX(input);
        this.moveY(input);
    }

    private moveX(input: InputHandler): void {
        if (input.keyPressed(CONTROLS.RIGHT)) {
            this.vx = this.maxVX;
        } else if (input.keyPressed(CONTROLS.LEFT)) {
            this.vx = -this.maxVX;
        } else {
            this.vx = 0;
        }
        this.x += this.vx;
        this.disallowOffscreen("left");
        this.disallowOffscreen("right");
    }

    private moveY(input: InputHandler): void {
        if (input.keyPressed(CONTROLS.JUMP) && this.onGround()) {
            this.vy -= this.maxVY;
        }
        if (!this.onGround()) {
            this.vy += this.weight;
        }
        this.y += this.vy;
        this.disallowOffscreen("bottom");
    }

    private onGround(): boolean {
        return this.isTouching("bottom");
    }
}