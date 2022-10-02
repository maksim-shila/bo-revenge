import Input from "../input";
import { KeyAction } from "../key-action";
import { GamepadKey, GamepadMapping } from "./gamepad-config";

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
        const axeBtns = this.triggeredByAxes(gamepad.axes.slice());
        for (let i = 0; i < buttons.length; i++) {
            if (!GamepadKey[i]) {
                continue;
            }
            const btn = buttons[i];
            const pressed = btn.pressed || axeBtns.includes(i);
            pressed ? this.onKeyDown(GamepadKey[i]) : this.onKeyUp(GamepadKey[i]);
        }
    }

    protected getKeys(action: KeyAction): string[] {
        return GamepadMapping[action].map(i => GamepadKey[i]);
    }

    private triggeredByAxes(axes: number[]): GamepadKey[] {
        const axeX = axes[0];
        const axeY = axes[1];
        if (Math.sqrt(axeX * axeX + axeY * axeY) < 1) {
            return [];
        }
        if (axeX >= 0 && axeY >= 0) {
            if (axeX === 1)
                return [GamepadKey.Right];
            if (axeY === 1)
                return [GamepadKey.Down];
            return [GamepadKey.Right, GamepadKey.Down];
        } else if (axeX >= 0 && axeY <= 0) {
            if (axeX === 1)
                return [GamepadKey.Right];
            if (axeY === -1)
                return [GamepadKey.Up];
            return [GamepadKey.Right, GamepadKey.Up];
        } else if (axeX <= 0 && axeY <= 0) {
            if (axeX === -1)
                return [GamepadKey.Left];
            if (axeY === -1)
                return [GamepadKey.Up];
            return [GamepadKey.Left, GamepadKey.Up];
        } else if (axeX <= 0 && axeY >= 0) {
            if (axeX === -1)
                return [GamepadKey.Left];
            if (axeY === 1)
                return [GamepadKey.Down];
            return [GamepadKey.Left, GamepadKey.Down];
        }
        return [];
    }
}