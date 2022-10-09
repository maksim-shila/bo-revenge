import { FrameTimer, Scene } from "../engine";
import InputHandler from "../input/input-handler";
import Player from "./player";

export default class DebugWindow {

    private keyboardKeysPressed: unknown[] = [];
    private gamepadKeysPressed: unknown[] = [];
    private gamepadConnected = false;

    private readonly frameTimerUpdateRate = 500;
    private frameTimerLastUpdate = 0;
    private readonly frameTimerStoreSize = 100;
    private readonly frameTimers: FrameTimer[] = [];
    private deltaTime = 0;
    private fps = 0;

    private readonly startX;
    private readonly startY = 0;
    private readonly valueOffset = 150;
    private readonly colWidth = 250;
    private readonly rowHeight = 20;

    constructor(
        private readonly player: Player,
        private readonly scene: Scene
    ) {
        this.startX = scene.width - 800;
    }

    public update(input: InputHandler, frameTimer: FrameTimer): void {
        this.keyboardKeysPressed = input.keyboard.keys;
        this.gamepadConnected = input.gamepad.connected;
        this.gamepadKeysPressed = input.gamepad.keys;

        const frameTimersLength = this.frameTimers.unshift(frameTimer);
        if (frameTimersLength > this.frameTimerStoreSize) {
            this.frameTimers.length = this.frameTimerStoreSize;
        }
        if (frameTimer.timeStamp - this.frameTimerLastUpdate > this.frameTimerUpdateRate) {
            this.frameTimerLastUpdate = frameTimer.timeStamp;
            const totalTime = this.frameTimers.map(ft => ft.deltaTime).reduce((a, b) => a + b, 0);
            const avgDeltaTime = totalTime / this.frameTimers.length;
            this.deltaTime = Math.round(avgDeltaTime * 100) / 100;
            this.fps = Math.round(1000 / avgDeltaTime * 100) / 100;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.font = "15px Book Antiqua";
        context.textAlign = "left";
        context.fillStyle = "white";

        this.show(context, "SceneVX", `${this.scene.vx}`, 1, 1);
        this.show(context, "PlayerX", `${this.player.x}`, 1, 2);
        this.show(context, "PlayerY", `${this.player.y}`, 1, 3);
        this.show(context, "PlayerVX", `${this.player.vx}`, 1, 4);
        this.show(context, "PlayerVY", `${this.player.vy}`, 1, 5);
        this.show(context, "PlayerWeight", `${this.player.weight}`, 1, 6);
        this.show(context, "PlayerOnGround", `${this.player.onGround}`, 1, 7);

        this.show(context, "Keyboard keys", this.keyboardKeysPressed.join(), 2, 1);
        this.show(context, "Gamepad connected", `${this.gamepadConnected}`, 2, 2);
        this.show(context, "Gamepad keys", this.gamepadKeysPressed.join(), 2, 3);

        this.show(context, "FPS", `${Math.round(this.fps * 100) / 100}`, 2, 5);
        this.show(context, "Delta time", `${Math.round(this.deltaTime * 100) / 100}`, 2, 6);

        this.show(context, "Sprites", `${this.scene.sprites.length}`, 2, 8);
        this.show(context, "Obstacles", `${this.scene.obstacles.length}`, 2, 9);
        this.show(context, "Particles", `${this.scene.particles.length}`, 2, 10);

        const colliders = this.scene.colliders;
        this.show(context, "Watch objects", `${colliders.watchObjects.length}`, 2, 12);
        this.show(context, "Colliders", `${colliders.watchPairs.length}`, 2, 13);
        this.show(context, "Collisions", `${colliders.collisions.length}`, 2, 14);
        context.restore();
    }

    private show(context: CanvasRenderingContext2D, key: string, value: string, col: number, row: number) {
        context.fillText(`${key}:`, this.startX + this.colWidth * col, this.startY + this.rowHeight * row);
        context.fillText(value, this.startX + this.colWidth * col + this.valueOffset, this.startY + this.rowHeight * row);
    }
}