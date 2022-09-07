import Game from "../game.js";

export interface SpriteConfig {
    imageId: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

type Direction = "right" | "left" | "top" | "bottom";

export default abstract class Sprite {
    protected readonly game: Game;
    protected readonly image: CanvasImageSource;
    protected readonly width: number;
    protected readonly height: number;
    protected x: number;
    protected y: number;
    protected frameX: number;
    protected frameY: number;

    constructor(game: Game, config: SpriteConfig) {
        this.game = game;
        this.image = document.getElementById(config.imageId) as CanvasImageSource;
        this.width = config.width;
        this.height = config.height;
        this.x = config.x;
        this.y = config.y;
        this.frameX = 0;
        this.frameY = 0;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /**
     * Checks if sprite is offscreen
     * @param direction direction to check
     * @param whole flag to check if moved partially or whole sprite is offscreen
     * @returns true if sprite is offscreen, otherwise false
     */
    protected isOffscreen(direction: Direction, whole = false): boolean {
        switch (direction) {
            case "right":
                return this.x > this.game.width - (whole ? 0 : this.width);
            case "left":
                return this.x < 0 - (whole ? this.width : 0);
            case "bottom":
                return this.y > this.game.height - (whole ? 0 : this.height);
            case "top":
                return this.y < 0 - (whole ? this.height : 0);
        }
    }

    protected isTouching(direction: Direction): boolean {
        switch (direction) {
            case "right":
                return this.x >= this.game.width - this.width;
            case "left":
                return this.x <= 0;
            case "bottom":
                return this.y >= this.game.height - this.height;
            case "top":
                return this.y <= 0;
        }
    }

    protected resetPosition(direction: Direction): void {
        switch (direction) {
            case "right":
                this.x = this.game.width - this.width;
                break;
            case "left":
                this.x = 0;
                break;
            case "bottom":
                this.y = this.game.height - this.height;
                break;
            case "top":
                this.y = 0;
                break;
        }
    }

    protected disallowOffscreen(direction: Direction): void {
        if (this.isOffscreen(direction)) {
            this.resetPosition(direction);
        }
    }
}