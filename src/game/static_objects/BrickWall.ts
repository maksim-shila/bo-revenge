import { Hitbox, Rect, RectHitbox } from "../core/hitbox.js";
import Sprite from "../core/sprite.js";
import Game from "../game.js";

export default class BrickWall {
    private readonly game: Game;
    private readonly bricks: Brick[][];
    public x: number;
    public y: number;

    public readonly width: number;
    public readonly height: number;

    public hitbox: Hitbox;

    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.bricks = [
            [new Brick(game), new Brick(game)],
            [new Brick(game), new Brick(game)],
            [new Brick(game), new Brick(game)],
        ];

        this.width = Brick.width * this.bricks[0].length;
        this.height = Brick.height * this.bricks.length;

        this.x = x;
        this.y = y - this.height;

        const rect = new Rect({ x: this.x, y: this.y, width: this.width, height: this.height });
        this.hitbox = new RectHitbox({ parent: rect });
    }

    public update(): void {
        this.bricks.forEach((row, rowIndex) => {
            row.forEach((brick, colIndex) => {
                brick.update(this.x, this.y, rowIndex, colIndex);
            });
        });
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.game.config.debug) {
            this.hitbox.draw(context);
        }
        this.bricks.forEach(row => row.forEach(brick => brick.draw(context)));
    }
}

class Brick extends Sprite {

    private static spriteWidth = 239;
    private static spriteHeight = 224;
    private static scale = 0.25;
    public static width = this.spriteWidth * this.scale;
    public static height = this.spriteHeight * this.scale;

    constructor(game: Game) {
        super(game, { imageId: "brickImg", width: Brick.spriteWidth, height: Brick.spriteHeight, scale: Brick.scale });
    }

    public update(parentX: number, parentY: number, rowIndex: number, colIndex: number): void {
        this.x = parentX + this.width * colIndex;
        this.y = parentY + this.height * rowIndex;
    }
}