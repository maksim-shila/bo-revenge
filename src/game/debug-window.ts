import { FrameTimer } from "../engine";
import InputHandler from "../input/input-handler";
import Game from "./game";

export default class DebugWindow {

    private game: Game;
    private keyboardKeysPressed: unknown[] = [];
    private gamepadKeysPressed: unknown[] = [];
    private gamepadConnected = false;

    private readonly frameTimerUpdateRate = 500;
    private frameTimerLastUpdate = 0;
    private readonly frameTimerStoreSize = 100;
    private readonly frameTimers: FrameTimer[] = [];
    private deltaTime = 0;
    private fps = 0;

    constructor(game: Game) {
        this.game = game;
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
        const nameX = this.game.width - 350;
        const valueX = nameX + 150;
        const rowHeight = 20;

        context.save();
        context.font = "15px Book Antiqua";
        context.textAlign = "left";
        context.fillStyle = "white";
        context.fillText("Keyboard keys:", nameX, rowHeight * 1);
        context.fillText(this.keyboardKeysPressed.join(), valueX, rowHeight * 1);
        context.fillText("Gamepad connected:", nameX, rowHeight * 2);
        context.fillText(`${this.gamepadConnected}`, valueX, rowHeight * 2);
        context.fillText("Gamepad keys:", nameX, rowHeight * 3);
        context.fillText(this.gamepadKeysPressed.join(), valueX, rowHeight * 3);
        context.fillText("FPS:", nameX, rowHeight * 5);
        context.fillText(`${Math.round(this.fps * 100) / 100}`, valueX, rowHeight * 5);
        context.fillText("Delta time:", nameX, rowHeight * 6);
        context.fillText(`${Math.round(this.deltaTime * 100) / 100}`, valueX, rowHeight * 6);

        context.fillText("Sprites:", nameX, rowHeight * 8);
        context.fillText(`${this.game.scene.sprites.length}`, valueX, rowHeight * 8);
        context.fillText("Obstacles:", nameX, rowHeight * 9);
        context.fillText(`${this.game.scene.obstacles.length}`, valueX, rowHeight * 9);

        const colliders = this.game.scene.colliders;
        context.fillText("Watch objects:", nameX, rowHeight * 11);
        context.fillText(`${colliders.watchObjects.length}`, valueX, rowHeight * 11);
        context.fillText("Colliders:", nameX, rowHeight * 12);
        context.fillText(`${colliders.watchPairs.length}`, valueX, rowHeight * 12);
        context.fillText("Collisions:", nameX, rowHeight * 13);
        context.fillText(`${colliders.collisions.length}`, valueX, rowHeight * 13);

        context.restore();
    }
}