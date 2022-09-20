import { KeyAction } from "../key-action.js";

export enum GamepadKey {
    A = 0,
    B = 1,
    X = 2,
    Y = 3,
    L1 = 4,
    R1 = 5,
    L2 = 6,
    R2 = 7,
    Select = 8,
    Start = 9,
    Up = 12,
    Down = 13,
    Left = 14,
    Right = 15
}

export const GamepadMapping = {} as GamepadMappingType;
GamepadMapping["jump"] = [GamepadKey.A];
GamepadMapping["up"] = [GamepadKey.Up];
GamepadMapping["down"] = [GamepadKey.Down];
GamepadMapping["left"] = [GamepadKey.Left];
GamepadMapping["right"] = [GamepadKey.Right];
GamepadMapping["roll"] = [GamepadKey.R2];
GamepadMapping["select"] = [GamepadKey.Select];
GamepadMapping["pause"] = [GamepadKey.Start];
GamepadMapping["back"] = [GamepadKey.B];

type GamepadMappingType = { [key in KeyAction]: GamepadKey[]; }
