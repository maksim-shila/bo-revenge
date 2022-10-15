import Collider from "./Collider";
import GameObject from "./GameObject";

export default class Rect extends GameObject {

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.collider = new Collider(this);
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = "lightgreen";
        context.fillRect(this.x, this.y, this.width, this.height);
        this.collider?.draw(context);
    }
}