import Gamepad from "./gamepad/gamepad.js";
import Keyboard from "./keyboard/keyboard.js";
import { KeyAction } from "./key-action.js";
import GameConfig from "../global.js";

export default class InputHandler {

    public readonly gamepad: Gamepad;
    public readonly keyboard: Keyboard;
    private readonly _globalConfig: GameConfig;
    private readonly _cheats: Cheats;

    constructor(globalConfig: GameConfig) {
        this._globalConfig = globalConfig;
        this.gamepad = new Gamepad();
        this.keyboard = new Keyboard();
        this._cheats = new Cheats(this.keyboard, this._globalConfig);
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
    private readonly _globalConfig: GameConfig;

    constructor(keyboard: Keyboard, globalConfig: GameConfig) {
        this._keyboard = keyboard;
        this._globalConfig = globalConfig;
    }

    public apply(): void {
        if (this._keyboard.getSequence().endsWith("debug")) {
            this._globalConfig.debug = !this._globalConfig.debug;
            this._keyboard.clearSequence();
        }
    }
}