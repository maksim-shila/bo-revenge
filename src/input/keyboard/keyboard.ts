import Input from "../input";
import { KeyAction } from "../key-action";
import { KeyboardKey, KeyboardKeys, KeyboardMapping } from "./keyboard-config";

export default class Keyboard extends Input<KeyboardKey>{

    private static readonly SequenceLength = 10;
    private _sequence: string[];

    constructor() {
        super();
        this._sequence = [];
        window.addEventListener("keydown", e => {
            e.preventDefault();
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
            e.preventDefault();
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