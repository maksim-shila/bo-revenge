import * as Bad from "bad-engine";

let inputHandler: Bad.Input = Bad.Inputs.Keyboard;
export function InputHandler(): Bad.Input { return inputHandler; }

Bad.Inputs.Gamepads.onGamepadConnected = () => {
    inputHandler = Bad.Inputs.Gamepads.first() ?? Bad.Inputs.Keyboard;
};
Bad.Inputs.Gamepads.onGamepadDisconnected = () => {
    inputHandler = Bad.Inputs.Gamepads.first() ?? Bad.Inputs.Keyboard;
};

Bad.Inputs.Keyboard.onSequence("debug", () => Bad.Global.debug = !Bad.Global.debug);

export const Actions = {
    Up: new Bad.KeyAction("up"),
    Down: new Bad.KeyAction("down"),
    Left: new Bad.KeyAction("left"),
    Right: new Bad.KeyAction("right"),
    Jump: new Bad.KeyAction("jump"),
    Roll: new Bad.KeyAction("roll"),
    Dash: new Bad.KeyAction("dash"),
    Select: new Bad.KeyAction("select"),
    Pause: new Bad.KeyAction("pause"),
    Back: new Bad.KeyAction("back")
};

Actions.Up.bind("keyboard", ["ArrowUp", "KeyW"]);
Actions.Down.bind("keyboard", ["ArrowDown", "KeyS"]);
Actions.Left.bind("keyboard", ["ArrowLeft", "KeyA"]);
Actions.Right.bind("keyboard", ["ArrowRight", "KeyD"]);
Actions.Jump.bind("keyboard", ["Space"]);
Actions.Roll.bind("keyboard", ["ShiftLeft", "ShiftRight"]);
Actions.Dash.bind("keyboard", ["ControlLeft", "ControlRight"]);
Actions.Select.bind("keyboard", ["Enter"]);
Actions.Pause.bind("keyboard", ["Escape"]);
Actions.Back.bind("keyboard", ["Escape"]);

Actions.Up.bind("xbox", [Bad.XBoxKey.Up, Bad.XBoxKey.Axe1.Up]);
Actions.Down.bind("xbox", [Bad.XBoxKey.Down, Bad.XBoxKey.Axe1.Down]);
Actions.Left.bind("xbox", [Bad.XBoxKey.Left, Bad.XBoxKey.Axe1.Left]);
Actions.Right.bind("xbox", [Bad.XBoxKey.Right, Bad.XBoxKey.Axe1.Right]);
Actions.Jump.bind("xbox", [Bad.XBoxKey.A]);
Actions.Roll.bind("xbox", [Bad.XBoxKey.R2]);
Actions.Dash.bind("xbox", [Bad.XBoxKey.R1, Bad.XBoxKey.L1]);
Actions.Select.bind("xbox", [Bad.XBoxKey.A]);
Actions.Pause.bind("xbox", [Bad.XBoxKey.Start]);
Actions.Back.bind("xbox", [Bad.XBoxKey.B]);