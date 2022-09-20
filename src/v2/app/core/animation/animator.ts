import ScreenObject from "../screen-object.js";
import { Frame, Animation } from "./animation.js";

interface AnimatorProps {
    spriteWidth: number;
    spriteHeight: number;
}

export default class Animator {

    private _parent: ScreenObject;
    private _image: CanvasImageSource;
    private _spriteWidth: number;
    private _spriteHeight: number;

    private _fps = 60;
    private _frameInterval = 1000 / this._fps;
    private _frameTimer = 0;

    private _frame: Frame | null = null;
    private _animation: Animation | null = null;

    constructor(parent: ScreenObject, imageId: string, props?: AnimatorProps) {
        this._parent = parent;
        this._image = document.getElementById(imageId) as CanvasImageSource;
        this._spriteWidth = props?.spriteWidth ?? parent.width;
        this._spriteHeight = props?.spriteHeight ?? parent.height;
    }

    private set fps(value: number) {
        if (value > 60) {
            return;
        }
        this._fps = value;
        this._frameInterval = 1000 / this._fps;
    }

    public set animation(animation: Animation) {
        this._animation = animation;
    }

    public update(deltaTime: number): void {
        if (!this._animation) {
            return;
        }
        if (this._frameTimer > this._frameInterval) {
            this._frame = this._animation.getNextFrame();
            this._frameTimer = 0;
        } else {
            this._frameTimer += deltaTime;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (!this._frame) {
            return;
        }
        context.drawImage(
            this._image,
            this._frame.x * this._spriteWidth,
            this._frame.y * this._spriteHeight,
            this._spriteWidth,
            this._spriteHeight,
            this._parent.x,
            this._parent.y,
            this._parent.width,
            this._parent.height
        );
    }
}