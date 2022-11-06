import * as Bad from "bad-engine";
import Game from "./game/game";
import MainMenu from "./menu/mainMenu";
import { InputHandler } from "./input/Controls";

window.addEventListener("load", () => {

    Bad.Global.window.width = window.innerWidth;
    Bad.Global.window.height = 650;

    Bad.Global.debug = false;

    Bad.Global.cheats.immortal = true;
    Bad.Global.cheats.unlimitedEnergy = true;
    Bad.Global.cheats.preventEnemiesSpawn = false;

    const game = new Game(Bad.Global.window.width, Bad.Global.window.height, InputHandler);
    const mainMenu = new MainMenu(game);
    const gameCycle = new Bad.GameCycle();

    gameCycle.tick = (frame: Bad.Frame) => {
        if (!game.running) {
            mainMenu.update(InputHandler);
        } else {
            game.update(InputHandler, frame);
            game.draw();
        }
    };

    mainMenu.show();
    gameCycle.start();
});