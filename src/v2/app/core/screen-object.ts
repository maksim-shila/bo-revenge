export default class ScreenObject {

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    public get x(): number {
        return this._x;
    }

    protected set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    protected set y(value: number) {
        this._y = value;
    }

    public get rx(): number {
        return this._x + this._width;
    }

    public get ry(): number {
        return this._y + this._height;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }
}