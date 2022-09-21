import Game from "../game.js";
import Dimension from "./dimension.js";
import Hitbox, { RectHitbox } from "./hitbox.js";
import { ObjectType } from "./screen-object-type.js";

type Direction = "right" | "left" | "top" | "bottom";

export default class ScreenObject {

    private _windowWidth: number;
    private _windowHeight: number;

    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public width: number;
    public height: number;
    public hitbox: Hitbox;

    public readonly type: ObjectType;
    public readonly dimension: Dimension;

    constructor(type: ObjectType, game: Game, x: number, y: number, dimension: Dimension) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = dimension.width;
        this.height = dimension.height;
        this.hitbox = new RectHitbox(this);
        this._windowWidth = game.width;
        this._windowHeight = game.height;
        this.type = type;
        this.dimension = dimension;
    }

    public get rx(): number {
        return this.x + this.width;
    }

    public get ry(): number {
        return this.y + this.height;
    }

    public get cx(): number {
        return this.x + this.width * 0.5;
    }

    public get cy(): number {
        return this.y + this.height * 0.5;
    }

    public isOffscreen(direction: Direction): boolean {
        switch (direction) {
            case "right":
                return this.x > this._windowWidth;
            case "left":
                return this.rx < 0;
            case "bottom":
                return this.y > this._windowHeight;
            case "top":
                return this.ry < 0;
        }
    }

    public isTouchingScreen(direction: Direction): boolean {
        switch (direction) {
            case "right":
                return this.rx >= this._windowWidth;
            case "left":
                return this.x <= 0;
            case "bottom":
                return this.ry >= this._windowHeight;
            case "top":
                return this.y <= 0;
        }
    }

    public moveToScreen(direction: Direction): void {
        switch (direction) {
            case "right":
                this.x = this._windowWidth - this.width;
                this.vx = 0;
                break;
            case "left":
                this.x = 0;
                this.vx = 0;
                break;
            case "bottom":
                this.y = this._windowHeight - this.height;
                this.vy = 0;
                break;
            case "top":
                this.y = 0;
                this.vy = 0;
                break;
        }
    }

    public preventOffscreen(direction: Direction): void {
        if (this.isTouchingScreen(direction)) {
            this.moveToScreen(direction);
        }
    }
}