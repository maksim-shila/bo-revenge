import Gamepad from "./gamepad/gamepad.js";
import Keyboard from "./keyboard/keyboard.js";
import { KeyAction } from "./key-action.js";
import GameConfig from "../global.js";

export default class InputHandler {

    private readonly _globalConfig: GameConfig;
    private readonly _gamepad: Gamepad;
    private readonly _keyboard: Keyboard;
    private readonly _cheats: Cheats;

    constructor(globalConfig: GameConfig) {
        this._globalConfig = globalConfig;
        this._gamepad = new Gamepad();
        this._keyboard = new Keyboard();
        this._cheats = new Cheats(this._keyboard, this._globalConfig);
    }

    public keyPressedOnce(action: KeyAction): boolean {
        return this._gamepad.connected
            ? this._gamepad.keyPressedOnce(action)
            : this._keyboard.keyPressedOnce(action);
    }

    public keyPressed(action: KeyAction): boolean {
        this._cheats.apply();
        return this._gamepad.connected
            ? this._gamepad.keyPressed(action)
            : this._keyboard.keyPressed(action);
    }

    public keyReleased(action: KeyAction): boolean {
        return this._gamepad.connected
            ? this._gamepad.keyReleased(action)
            : this._keyboard.keyReleased(action);
    }

    public update(): void {
        this._gamepad.update();
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