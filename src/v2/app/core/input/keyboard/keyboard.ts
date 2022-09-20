import Input from "../input.js";
import { KeyAction } from "../key-action.js";
import { KeyboardKey, KeyboardKeys, KeyboardMapping } from "./keyboard-config.js";

export default class Keyboard extends Input<KeyboardKey>{
    constructor() {
        super();
        window.addEventListener("keydown", e => {
            const key = e.code as KeyboardKey;
            if (KeyboardKeys.includes(key)) {
                this.onKeyDown(key);
            }
        });
        window.addEventListener("keyup", e => {
            const key = e.code as KeyboardKey;
            if (KeyboardKeys.includes(key)) {
                this.onKeyUp(key);
            }
        });
    }

    protected getKeys(action: KeyAction): KeyboardKey[] {
        return KeyboardMapping[action];
    }
}