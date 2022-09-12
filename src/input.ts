const ALLOWED_KEYS = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "KeyW",
    "KeyS",
    "KeyA",
    "KeyD",
    "Space",
    "GamepadUp",
    "GamepadDown",
    "GamepadLeft",
    "GamepadRight",
    "GamepadA"
] as const;

type GameKey = typeof ALLOWED_KEYS[number];
type KeyAction = "jump" | "down" | "left" | "right";
type Controls = { [key in KeyAction]: GameKey[] };
type GameKeyListener = (code: GameKey) => unknown;

const CONTROLS = {} as Controls;
CONTROLS["jump"] = ["ArrowUp", "KeyW", "Space", "GamepadA", "GamepadUp"];
CONTROLS["down"] = ["ArrowDown", "KeyS", "GamepadDown"];
CONTROLS["left"] = ["ArrowLeft", "KeyA", "GamepadLeft"];
CONTROLS["right"] = ["ArrowRight", "KeyD", "GamepadRight"];

export default class InputHandler {
    private keys: string[];
    private gamepad: Gamepad;

    constructor() {
        this.keys = [];
        this.gamepad = new Gamepad(this.keydown, this.keyup);
        window.addEventListener("keydown", e => this.keydown(e.code as GameKey));
        window.addEventListener("keyup", e => this.keyup(e.code as GameKey));
    }

    public update(): void {
        if (this.gamepad.connected) {
            this.gamepad.update();
        }
    }

    public keyPressed(...keyAction: KeyAction[]): boolean {
        return this.keyStateIs("pressed", keyAction);
    }

    public keyReleased(...keyAction: KeyAction[]): boolean {
        return this.keyStateIs("released", keyAction);
    }

    private keyStateIs(state: "pressed" | "released", keyAction: KeyAction[]): boolean {
        const keys = keyAction.flatMap(k => CONTROLS[k]);
        for (let i = 0; i < keys.length; ++i) {
            if (this.keys.includes(keys[i])) {
                return state === "pressed";
            }
        }
        return state === "released";
    }

    private keydown = (code: GameKey): void => {
        if (!this.keys.includes(code) && ALLOWED_KEYS.includes(code)) {
            this.keys.push(code);
        }
    };

    private keyup = (code: GameKey): void => {
        const keyCodeIndex = this.keys.indexOf(code);
        if (keyCodeIndex !== -1) {
            this.keys.splice(keyCodeIndex, 1);
        }
    };
}

const GAMEPAD_CONTROLS: GameKey[] = [];
GAMEPAD_CONTROLS[0] = "GamepadA";
GAMEPAD_CONTROLS[12] = "GamepadUp";
GAMEPAD_CONTROLS[13] = "GamepadDown";
GAMEPAD_CONTROLS[14] = "GamepadLeft";
GAMEPAD_CONTROLS[15] = "GamepadRight";

class Gamepad {
    private readonly onKeyDown: GameKeyListener;
    private readonly onKeyUp: GameKeyListener;
    private _connected: boolean;

    constructor(onKeyDown: GameKeyListener, onKeyUp: GameKeyListener) {
        this._connected = false;
        window.addEventListener("gamepadconnected", () => this._connected = true);
        window.addEventListener("gamepaddisconnected", () => this._connected = false);
        this.onKeyDown = onKeyDown;
        this.onKeyUp = onKeyUp;
    }

    public get connected(): boolean {
        return this._connected;
    }

    update(): void {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            return;
        }
        const gamepad = gamepads[0];
        if (!gamepad) {
            return;
        }
        for (let i = 0; i < gamepad.buttons.length; ++i) {
            const gamepadBtn = gamepad.buttons[i];
            const key = GAMEPAD_CONTROLS[i];
            if (!key) {
                return;
            }
            gamepadBtn.pressed ? this.onKeyDown(key) : this.onKeyUp(key);
        }
    }
}