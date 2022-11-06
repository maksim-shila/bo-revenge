import * as Bad from "bad-engine";
import Game from "./game/game";
import MainMenu from "./menu/mainMenu";
import GameMenu from "./game/gameMenu";
import Canvas from "./utils/canvas";
import { InputHandler } from "./input/Controls";

window.addEventListener("load", () => {

    Bad.Global.window.width = window.innerWidth;
    Bad.Global.window.height = 650;

    Bad.Global.debug = false;

    Bad.Global.cheats.immortal = true;
    Bad.Global.cheats.unlimitedEnergy = true;
    Bad.Global.cheats.preventEnemiesSpawn = false;

    const canvas = new Canvas(Bad.Global.window.width, Bad.Global.window.height);

    const game = new Game(Bad.Global.window.width, Bad.Global.window.height, InputHandler);
    game.onPause = (): void => gameMenu.show();
    game.onContinue = (): void => gameMenu.hide();

    const mainMenu = new MainMenu({
        onStartNewGame: (): void => {
            game.start();
            mainMenu.hide();
            canvas.show();
        }
    });
    mainMenu.show();

    const gameMenu = new GameMenu({
        onContinue: (): void => {
            gameMenu.hide();
            game.continue();
        },
        onRestart: (): void => {
            game.restart();
            gameMenu.hide();
        },
        onExit: (): void => {
            game.stop();
            canvas.hide();
            gameMenu.hide();
            mainMenu.show();
        }
    });

    const gameCycle = new Bad.GameCycle();

    gameCycle.tick = (frame: Bad.Frame) => {
        if (!game.running) {
            mainMenu.update(InputHandler);
        }
        else {
            if (game.paused) {
                gameMenu.update(InputHandler);
            } else {
                canvas.clear();
                game.update(InputHandler, frame);
                game.draw(canvas.context);
            }
        }
    };

    gameCycle.start();
});