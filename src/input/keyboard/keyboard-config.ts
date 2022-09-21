import { KeyAction } from "../key-action.js";

export const KeyboardKeys = [
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
    "ControlLeft",
    "ControlRight",
    "Enter",
    "Escape"
] as const;

export type KeyboardKey = typeof KeyboardKeys[number];

export const KeyboardMapping = {} as KeyboardMappingType;
KeyboardMapping["jump"] = ["Space"];
KeyboardMapping["up"] = ["ArrowUp", "KeyW"];
KeyboardMapping["down"] = ["ArrowDown", "KeyS"];
KeyboardMapping["left"] = ["ArrowLeft", "KeyA"];
KeyboardMapping["right"] = ["ArrowRight", "KeyD"];
KeyboardMapping["roll"] = ["ShiftLeft", "ShiftRight"];
KeyboardMapping["dash"] = ["ControlLeft", "ControlRight"];
KeyboardMapping["select"] = ["Enter"];
KeyboardMapping["pause"] = ["Escape"];
KeyboardMapping["back"] = ["Escape"];

type KeyboardMappingType = { [key in KeyAction]: KeyboardKey[]; }