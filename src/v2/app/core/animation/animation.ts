export interface Frame {
    x: number;
    y: number;
}

export interface Animation {
    getNextFrame(): Frame;
}

export class AnimationRow implements Animation {

    private _frameX: number;
    private _frameY: number;
    private _framesCount: number;

    constructor(frameY: number, framesCount: number) {
        this._frameX = 0;
        this._frameY = frameY;
        this._framesCount = framesCount;
    }

    public getNextFrame(): Frame {
        const frameX = this._frameX;
        this._frameX = ++this._frameX % this._framesCount;
        return { x: frameX, y: this._frameY };
    }

}