import Game from "../game.js";
import { Rect } from "./hitbox.js";

export interface SpriteConfig {
    imageId: string;
    width: number;
    height: number;
}

type Direction = "right" | "left" | "top" | "bottom";

export default abstract class Sprite {

    protected readonly game: Game;
    protected readonly image: CanvasImageSource;
    public readonly rect: Rect;
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
        this.rect = new Rect({ x: 0, y: 0, width: config.width, height: config.height });
        this.frameX = 0;
        this.frameY = 0;
        this.framesCount = 0;
        this.vx = 0;
        this.vy = 0;
        this.fps = 30;
    }

    public get x(): number {
        return this.rect.x;
    }

    public set x(value: number) {
        this.rect.x = value;
    }

    public get y(): number {
        return this.rect.y;
    }

    public set y(value: number) {
        this.rect.y = value;
    }

    public get width(): number {
        return this.rect.width;
    }

    public get height(): number {
        return this.rect.height;
    }

    public get centerX(): number {
        return this.x + this.width * 0.5;
    }

    public get centerY(): number {
        return this.y + this.height * 0.5;
    }

    public get fps(): number {
        return this._fps;
    }

    public set fps(value: number) {
        this._fps = value;
        this._frameInterval = 1000 / this._fps;
    }

    public animate(deltaTime: number): void {
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

    public isOffscreen(...directions: Direction[]): boolean {
        const _isOffscreen = (direction: Direction): boolean => {
            switch (direction) {
                case "right":
                    return this.x > this.game.width;
                case "left":
                    return this.x < 0 - this.width;
                case "bottom":
                    return this.y > this.game.height - this.game.groundMargin;
                case "top":
                    return this.y < 0 - this.game.groundMargin - this.height;
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
                    return this.y >= this.game.height - this.height - this.game.groundMargin;
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
                this.y = this.game.height - this.height - this.game.groundMargin;
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
}