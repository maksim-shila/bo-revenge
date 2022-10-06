import { GameObject } from "../../engine";
import Game from "../game";

type Direction = "right" | "left" | "top" | "bottom";

// TODO: extending here is temporary, GameObject is going to replace Sprite at all
export default abstract class Sprite extends GameObject {

    protected readonly game: Game;

    constructor(type: string, game: Game, width: number, height: number) {
        super(type, 0, 0, width, height);
        this.game = game;
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
}