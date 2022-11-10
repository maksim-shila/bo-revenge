import Player from "../Player";
import { PlayerStateType, State } from "./PlayerState";
import { Dash } from "./states/Dash";
import { Diving } from "./states/Diving";
import { Falling } from "./states/Falling";
import { Hit } from "./states/Hit";
import { Jumping } from "./states/Jumping";
import { Rolling } from "./states/Rolling";
import { Running } from "./states/Running";
import { Sitting } from "./states/Sitting";
import { Standing } from "./states/Standing";

type States = { [key in PlayerStateType]: State };

export class PlayerStateManager {
    private readonly states: States;

    constructor(player: Player) {
        this.states = {} as States;
        this.states["standing"] = new Standing(player);
        this.states["jumping"] = new Jumping(player);
        this.states["falling"] = new Falling(player);
        this.states["running"] = new Running(player);
        this.states["sitting"] = new Sitting(player);
        this.states["rolling"] = new Rolling(player);
        this.states["diving"] = new Diving(player);
        this.states["hit"] = new Hit(player);
        this.states["dash"] = new Dash(player);
    }

    public get(type: PlayerStateType): State {
        return this.states[type];
    }
}