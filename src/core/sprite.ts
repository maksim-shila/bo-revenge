import Game from "../game.js";
import InputHandler from "../input.js";

export interface SpriteConfig {
    imageId: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

type Direction = "right" | "left" | "top" | "bottom";

export default abstract class Sprite {

    public readonly game: Game;
    public readonly image: CanvasImageSource;
    public readonly width: number;
    public readonly height: number;
    public x: number;
    public y: number;
    public frameX: number;
    public frameY: number;
    public framesCount: number;
    public vx: number;
    public vy: number;
    private _fps = 0;
    private _frameInterval = 0;
    private _frameTimer = 0;

    constructor(game: Game, config: SpriteConfig) {
        this.game = game;
        this.image = document.getElementById(config.imageId) as CanvasImageSource;
        this.width = config.width;
        this.height = config.height;
        this.x = config.x;
        this.y = config.y;
        this.frameX = 0;
        this.frameY = 0;
        this.framesCount = 0;
        this.vx = 0;
        this.vy = 0;
        this.fps = 30;
    }

    public get fps(): number {
        return this._fps;
    }

    public set fps(value: number) {
        this._fps = value;
        this._frameInterval = 1000 / this._fps;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(input: InputHandler, deltaTime: number): void {
        if (this._frameTimer > this._frameInterval) {
            this.frameX = ++this.frameX % this.framesCount;
            this._frameTimer = 0;
        } else {
            this._frameTimer += deltaTime;
        }
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
                this.vx = 0;
                break;
            case "left":
                this.x = 0;
                this.vx = 0;
                break;
            case "bottom":
                this.y = this.game.height - this.height;
                this.vy = 0;
                break;
            case "top":
                this.y = 0;
                this.vy = 0;
                break;
        }
    }

    protected disallowOffscreen(direction: Direction): void {
        if (this.isOffscreen(direction)) {
            this.resetPosition(direction);
        }
    }
}