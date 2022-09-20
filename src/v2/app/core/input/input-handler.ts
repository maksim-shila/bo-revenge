import GlobalConfig from "../../global-config.js";
import Gamepad from "./gamepad/gamepad.js";
import Keyboard from "./keyboard/keyboard.js";
import { KeyAction } from "./key-action.js";

export default class InputHandler {

    private readonly _globalConfig: GlobalConfig;
    private readonly _gamepad: Gamepad;
    private readonly _keyboard: Keyboard;

    constructor(globalConfig: GlobalConfig) {
        this._globalConfig = globalConfig;
        this._gamepad = new Gamepad();
        this._keyboard = new Keyboard();
    }

    public keyPressed(action: KeyAction): boolean {
        return this._keyboard.keyPressed(action) ||
            (this._gamepad.connected && this._gamepad.keyPressed(action));
    }

    public keyReleased(action: KeyAction): boolean {
        return this._keyboard.keyReleased(action) ||
            (this._gamepad.connected && this._gamepad.keyReleased(action));
    }

    public update(): void {
        this._gamepad.update();
    }
}