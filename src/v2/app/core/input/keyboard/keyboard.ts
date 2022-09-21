import Input from "../input.js";
import { KeyAction } from "../key-action.js";
import { KeyboardKey, KeyboardKeys, KeyboardMapping } from "./keyboard-config.js";

export default class Keyboard extends Input<KeyboardKey>{

    private static readonly SequenceLength = 10;
    private _sequence: string[];

    constructor() {
        super();
        this._sequence = [];
        window.addEventListener("keydown", e => {
            this._sequence.push(e.key);
            if (this._sequence.length > Keyboard.SequenceLength) {
                this._sequence.shift();
            }
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

    public getSequence(): string {
        return this._sequence.join("");
    }

    public clearSequence(): void {
        this._sequence = [];
    }

    protected getKeys(action: KeyAction): KeyboardKey[] {
        return KeyboardMapping[action];
    }
}