import { FrameTimer, GameObject } from "../../engine";
import Game from "../game";

export interface SpriteConfig {
    imageId: string;
    width: number;
    height: number;
    scale?: number;
}

type Direction = "right" | "left" | "top" | "bottom";

// TODO: extending here is temporary, GameObject is going to replace Sprite at all
export default abstract class Sprite extends GameObject {

    protected readonly game: Game;
    protected readonly image: CanvasImageSource;
    public frameX: number;
    public frameY: number;
    public spriteWidth: number;
    public spriteHeight: number;
    public framesCount: number;
    private _fps = 0;
    private _frameInterval = 0;
    private _frameTimer = 0;

    constructor(type: string, game: Game, config: SpriteConfig) {
        super(type, 0, 0, Math.ceil(config.width * (config.scale ?? 1)), Math.ceil(config.height * (config.scale ?? 1)));
        this.game = game;
        this.image = document.getElementById(config.imageId) as CanvasImageSource;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = config.width;
        this.spriteHeight = config.height;
        this.framesCount = 0;
        this.fps = 30;
    }

    public get fps(): number {
        return this._fps;
    }

    public set fps(value: number) {
        this._fps = value;
        this._frameInterval = 1000 / this._fps;
    }

    public animate(frameTimer: FrameTimer): void {
        if (this._frameTimer > this._frameInterval) {
            this.frameX = ++this.frameX % this.framesCount;
            this._frameTimer = 0;
        } else {
            this._frameTimer += frameTimer.deltaTime;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    public isOffscreen(...directions: Direction[]): boolean {
        const _isOffscreen = (direction: Direction): boolean => {
            switch (direction) {
                case "right":
                    return this.x > this.game.width;
                case "left":
                    return this.x < 0 - this.width;
                case "bottom":
                    return this.y > this.game.height;
                case "top":
                    return this.y < 0 - this.height;
            }
        };
        for (let i = 0; i < directions.length; ++i) {
            if (_isOffscreen(directions[i])) {
                return true;
            }
        }
        return false;
    }

    public isTouching(...directions: Direction[]): boolean {
        const _isTouching = (direction: Direction): boolean => {
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
        };
        for (let i = 0; i < directions.length; ++i) {
            if (_isTouching(directions[i])) {
                return true;
            }
        }
        return false;
    }

    public resetPosition(direction: Direction): void {
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

    public disallowOffscreen(direction: Direction): void {
        if (this.isTouching(direction)) {
            this.resetPosition(direction);
        }
    }

    public isMaxFrame(): boolean {
        return this.frameX === this.framesCount - 1;
    }
}