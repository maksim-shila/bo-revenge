import ScreenObject from "./screen-object.js";

export class RectHitbox extends ScreenObject {

    private readonly _parent: ScreenObject;

    constructor(parent: ScreenObject) {
        super(parent.x, parent.y, parent.width, parent.height);
        this._parent = parent;
    }

    public override get x(): number {
        return this._parent.x;
    }

    public override get y(): number {
        return this._parent.y;
    }
}