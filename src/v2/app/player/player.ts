import { AnimationRow } from "../core/animation/animation.js";
import Animator from "../core/animation/animator.js";
import InputHandler from "../core/input/input-handler.js";
import ScreenObject from "../core/screen-object.js";

export default class Player extends ScreenObject {

    private static readonly FrameWidth = 100.3;
    private static readonly FrameHeight = 91.3;

    public readonly animator: Animator;

    constructor(spawnX: number, spawnY: number) {
        super(spawnX, spawnY, Player.FrameWidth, Player.FrameHeight);
        this.animator = new Animator(this, "playerImg");
        this.animator.animation = new AnimationRow(3, 9);
    }

    public update(deltaTime: number, input: InputHandler): void {
        this.animator.update(deltaTime);
        if (input.keyPressed("right")) {
            this.x += 3;
        } else if (input.keyPressed("left")) {
            this.x -= 3;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.animator.draw(context);
    }
}