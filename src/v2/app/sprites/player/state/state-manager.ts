import Game from "../../../game.js";
import Diving from "./diving.js";
import Falling from "./falling.js";
import Hit from "./hit.js";
import Jumping from "./jumping.js";
import Rolling from "./rolling.js";
import Running from "./running.js";
import Sitting from "./sitting.js";
import Standing from "./standing.js";
import State from "./state.js";
import { StateType } from "./state-type.js";

type States = { [key in StateType]: State };

export default class StateManager {
    private readonly states: States;

    constructor(game: Game) {
        this.states = {} as States;
        this.states["standing"] = new Standing(game);
        this.states["jumping"] = new Jumping(game);
        this.states["falling"] = new Falling(game);
        this.states["running"] = new Running(game);
        this.states["sitting"] = new Sitting(game);
        this.states["rolling"] = new Rolling(game);
        this.states["diving"] = new Diving(game);
        this.states["hit"] = new Hit(game);
    }

    public get(type: StateType): State {
        return this.states[type];
    }
}