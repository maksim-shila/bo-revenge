import * as Bad from "bad-engine";

export default class Ground extends Bad.GameObject {

    public static readonly Width = 1667;
    public static readonly Height = 129;

    constructor(scene: Bad.Scene, x = 0) {
        super("obstacle", scene, Ground.Width, Ground.Height);
        this.x = x;
        this.y = scene.height - this.height;
        this.animator = new Bad.Animator("groundImg", this.width, this.height);
        this.collider = new Bad.RectCollider(this, 0, 70);
    }
}