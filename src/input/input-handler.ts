import * as Bad from "bad-engine";
import Gamepad from "./gamepad/gamepad";
import Keyboard from "./keyboard/keyboard";
import { KeyAction } from "./key-action";

export default class InputHandler {

    public readonly gamepad: Gamepad;
    public readonly keyboard: Keyboard;
    private readonly _cheats: Cheats;

    constructor() {
        this.gamepad = new Gamepad();
        this.keyboard = new Keyboard();
        this._cheats = new Cheats(this.keyboard);
    }

    public keyPressedOnce(action: KeyAction): boolean {
        return this.gamepad.connected
            ? this.gamepad.keyPressedOnce(action)
            : this.keyboard.keyPressedOnce(action);
    }

    public keyPressed(action: KeyAction): boolean {
        this._cheats.apply();
        return this.gamepad.connected
            ? this.gamepad.keyPressed(action)
            : this.keyboard.keyPressed(action);
    }

    public keyReleased(action: KeyAction): boolean {
        return this.gamepad.connected
            ? this.gamepad.keyReleased(action)
            : this.keyboard.keyReleased(action);
    }

    public update(): void {
        this.gamepad.update();
    }
}

class Cheats {

    private readonly _keyboard: Keyboard;

    constructor(keyboard: Keyboard) {
        this._keyboard = keyboard;
    }

    public apply(): void {
        if (this._keyboard.getSequence().endsWith("debug")) {
            Bad.Global.debug = !Bad.Global.debug;
            this._keyboard.clearSequence();
        }
    }
}