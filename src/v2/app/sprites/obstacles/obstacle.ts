import ScreenObject from "../../core/screen-object.js";

export default abstract class Obstacle extends ScreenObject {
    public abstract update(): void;
    public abstract draw(context: CanvasRenderingContext2D): void;
}