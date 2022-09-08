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
type Control = { keys: GameKey[] };
type GameKeyListener = (code: GameKey) => unknown;

interface Controls {
    JUMP: Control,
    DOWN: Control,
    LEFT: Control;
    RIGHT: Control
}

export const CONTROLS: Controls = {
    JUMP: { keys: ["ArrowUp", "KeyW", "Space", "GamepadA", "GamepadUp"] },
    DOWN: { keys: ["ArrowDown", "KeyS", "GamepadDown"] },
    LEFT: { keys: ["ArrowLeft", "KeyA", "GamepadLeft"] },
    RIGHT: { keys: ["ArrowRight", "KeyD", "GamepadRight"] },
};

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

    public keyPressed(...control: Control[]): boolean {
        return this.keyStateIs("pressed", control);
    }

    public keyReleased(...control: Control[]): boolean {
        return this.keyStateIs("released", control);
    }

    private keyStateIs(state: "pressed" | "released", control: Control[]): boolean {
        const keys = control.flatMap(c => c.keys);
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

const GAMEPAD_CONTROL: Control = { keys: [] };
GAMEPAD_CONTROL.keys[0] = "GamepadA";
GAMEPAD_CONTROL.keys[12] = "GamepadUp";
GAMEPAD_CONTROL.keys[13] = "GamepadDown";
GAMEPAD_CONTROL.keys[14] = "GamepadLeft";
GAMEPAD_CONTROL.keys[15] = "GamepadRight";

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
            const key = GAMEPAD_CONTROL.keys[i];
            if (!key) {
                return;
            }
            gamepadBtn.pressed ? this.onKeyDown(key) : this.onKeyUp(key);
        }
    }
}