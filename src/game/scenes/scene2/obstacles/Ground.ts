import { Animator, GameObject, RectCollider, Scene } from "../../../../engine";

export default class Ground extends GameObject {

    public static readonly Width = 1667;
    public static readonly Height = 129;

    constructor(scene: Scene, x = 0) {
        super("obstacle", scene, Ground.Width, Ground.Height);
        this.x = x;
        this.y = scene.height - this.height;
        this.animator = new Animator("groundImg", this.width, this.height);
        this.collider = new RectCollider(this, 0, 70);
    }
}