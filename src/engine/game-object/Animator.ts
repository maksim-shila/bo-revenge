import { FrameTimer } from "../utils/FrameTimer";

export class Animator {

    private readonly _image: CanvasImageSource;
    private readonly _sw: number;
    private readonly _sh: number;

    private _frameX = 0;
    private _frameY = 0;
    private _fps = 60;
    private _frameInterval = 1000 / this._fps;
    private _currentFrameInterval = 0;

    public animation: Animation | null = null;

    constructor(
        imageId: string,
        private readonly _width: number,
        private readonly _height: number,
        sw?: number,
        sh?: number,
    ) {
        this._image = document.getElementById(imageId) as CanvasImageSource;
        this._sw = sw ?? this._width;
        this._sh = sh ?? this._height;
    }

    public get fps(): number {
        return this._fps;
    }

    public set fps(value: number) {
        this._fps = value;
        this._frameInterval = 1000 / this._fps;
    }

    public update(frameTimer: FrameTimer): void {
        if (this.animation) {
            if (this._currentFrameInterval > this._frameInterval) {
                const nextFrame = this.animation.nextFrame;
                this._frameX = nextFrame.x;
                this._frameY = nextFrame.y;
                this._currentFrameInterval = 0;
            } else {
                this._currentFrameInterval += frameTimer.deltaTime;
            }
        }
    }

    public draw(context: CanvasRenderingContext2D, x: number, y: number): void {
        context.drawImage(
            this._image,
            this._frameX * this._sw,
            this._frameY * this._sh,
            this._sw,
            this._sh,
            x,
            y,
            this._width,
            this._height
        );
    }
}

interface Frame {
    x: number,
    y: number
}

export interface Animation {
    nextFrame: Frame,
    isMaxFrame: boolean,
    reset(): void;
}

export class AnimationRow implements Animation {

    private _frameX = 0;

    constructor(
        private readonly _frameY: number,
        private readonly _framesXCount: number
    ) { }

    public get nextFrame(): Frame {
        this._frameX = ++this._frameX % this._framesXCount;
        return {
            x: this._frameX,
            y: this._frameY
        };
    }

    public get isMaxFrame(): boolean {
        return this._frameX === this._framesXCount - 1;
    }

    public reset(): void {
        this._frameX = 0;
    }
}
