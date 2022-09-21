import Hitbox from "./hitbox.js";

export type CollisionType =
    "top" |
    "bottom" |
    "left" |
    "right";

export type CollisionState = "new" | "standingOn";

export default class Collision {
    public readonly hitbox: Hitbox;
    public type: CollisionType;
    public state: CollisionState;

    constructor(type: CollisionType, hitbox: Hitbox) {
        this.type = type;
        this.hitbox = hitbox;
        this.state = "new";
    }
}