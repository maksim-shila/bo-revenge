import Input from "../input.js";
import { KeyAction } from "../key-action.js";
import { GamepadKey, GamepadMapping } from "./gamepad-config.js";

export default class Gamepad extends Input<string> {

    private _connected = false;

    constructor() {
        super();
        window.addEventListener("gamepadconnected", () => this._connected = true);
        window.addEventListener("gamepaddisconnected", () => this._connected = false);
    }

    public get connected(): boolean {
        return this._connected;
    }

    public update(): void {
        if (!this._connected) {
            return;
        }
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        if (!gamepad) {
            return;
        }

        const buttons = gamepad.buttons;
        const axeBtn = this.triggeredByAxes(gamepad.axes.slice());
        for (let i = 0; i < buttons.length; i++) {
            if (!GamepadKey[i]) {
                continue;
            }
            const btn = buttons[i];
            const pressed = btn.pressed || axeBtn === i;
            pressed ? this.onKeyDown(GamepadKey[i]) : this.onKeyUp(GamepadKey[i]);
        }
    }

    protected getKeys(action: KeyAction): string[] {
        return GamepadMapping[action].map(i => GamepadKey[i]);
    }

    private triggeredByAxes(axes: number[]): GamepadKey | null {
        const axeX = axes[0];
        const axeY = axes[1];
        const mainOffset = 0.4;
        const backOffset = 0.7;
        if (axeY < -mainOffset && axeX > -backOffset && axeX < backOffset) {
            return GamepadKey.Up;
        }
        if (axeY > mainOffset && axeX > -backOffset && axeX < backOffset) {
            return GamepadKey.Down;
        }
        if (axeX < -mainOffset && axeY > -backOffset && axeY < backOffset) {
            return GamepadKey.Left;
        }
        if (axeX > mainOffset && axeY > -backOffset && axeY < backOffset) {
            return GamepadKey.Right;
        }
        return null;
    }
}