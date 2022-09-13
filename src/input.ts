import Game from "./game";

const ALLOWED_KEYS = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "KeyW",
    "KeyS",
    "KeyA",
    "KeyD",
    "KeyJ",
    "Space",
    "ShiftLeft",
    "ShiftRight",
    "GamepadUp",
    "GamepadDown",
    "GamepadLeft",
    "GamepadRight",
    "GamepadA",
    "GamepadB",
    "GamepadX",
    "GamepadY",
    "GamepadR2",
    "GamepadR1",
    "GamepadL2",
    "GamepadL1"
] as const;

type GameKey = typeof ALLOWED_KEYS[number];
type KeyAction = "jump" | "down" | "left" | "right" | "roll";
type Controls = { [key in KeyAction]: GameKey[] };
type GameKeyListener = (code: GameKey) => unknown;

const CONTROLS = {} as Controls;
CONTROLS["jump"] = ["ArrowUp", "KeyW", "Space", "GamepadA", "GamepadUp"];
CONTROLS["down"] = ["ArrowDown", "KeyS", "GamepadDown"];
CONTROLS["left"] = ["ArrowLeft", "KeyA", "GamepadLeft"];
CONTROLS["right"] = ["ArrowRight", "KeyD", "GamepadRight"];
CONTROLS["roll"] = ["ShiftLeft", "ShiftRight", "GamepadR2"];

export default class InputHandler {
    private readonly game: Game;
    private keys: string[];
    private gamepad: Gamepad;

    constructor(game: Game) {
        this.game = game;
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
        if (code === "KeyJ") {
            this.game.debug = !this.game.debug;
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
GAMEPAD_CONTROLS[1] = "GamepadB";
GAMEPAD_CONTROLS[2] = "GamepadX";
GAMEPAD_CONTROLS[3] = "GamepadY";
GAMEPAD_CONTROLS[4] = "GamepadL1";
GAMEPAD_CONTROLS[5] = "GamepadR1";
GAMEPAD_CONTROLS[6] = "GamepadL2";
GAMEPAD_CONTROLS[7] = "GamepadR2";
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
        GAMEPAD_CONTROLS.forEach((code, i) => {
            const gamepadBtn = gamepad.buttons[i];
            let btnPressed = gamepadBtn.pressed;
            switch (code) {
                case "GamepadLeft":
                    btnPressed ||= this.axePressed(gamepad, "left");
                    break;
                case "GamepadRight":
                    btnPressed ||= this.axePressed(gamepad, "right");
                    break;
                case "GamepadDown":
                    btnPressed ||= this.axePressed(gamepad, "down");
                    break;
                case "GamepadUp":
                    btnPressed ||= this.axePressed(gamepad, "up");
                    break;
            }
            btnPressed ? this.onKeyDown(code) : this.onKeyUp(code);
        });
    }

    private axePressed(gamepad: globalThis.Gamepad, direction: "up" | "down" | "left" | "right"): boolean {
        const axes = gamepad.axes;
        if (!axes) {
            return false;
        }
        const axeX = axes[0];
        const axeY = axes[1];
        const mainOffset = 0.4;
        const backOffset = 0.7;
        switch (direction) {
            case "up":
                return axeY < -mainOffset && axeX > -backOffset && axeX < backOffset;
            case "down":
                return axeY > mainOffset && axeX > -backOffset && axeX < backOffset;
            case "left":
                return axeX < -mainOffset && axeY > -backOffset && axeY < backOffset;
            case "right":
                return axeX > mainOffset && axeY > -backOffset && axeY < backOffset;
        }
    }
}