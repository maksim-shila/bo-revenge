import Game from "./game/game";
import MainMenu from "./menu/mainMenu";
import GameMenu from "./game/gameMenu";
import Canvas from "./utils/canvas";
import InputHandler from "./input/input-handler";
import { Global } from "./engine";

window.addEventListener("load", () => {

    Global.window.width = window.innerWidth;
    Global.window.height = 500;

    Global.debug = false;

    Global.cheats.immortal = false;
    Global.cheats.unlimitedEnergy = false;
    Global.cheats.preventEnemiesSpawn = false;

    const input = new InputHandler();
    const canvas = new Canvas(Global.window.width, Global.window.height);
    let game = newGame();

    function newGame(): Game {
        const game = new Game(Global.window.width, Global.window.height, input);
        game.onPause = (): void => gameMenu.show();
        game.onContinue = (): void => gameMenu.hide();
        return game;
    }

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
            game.stop();
            game = newGame();
            game.start();
            gameMenu.hide();
        },
        onExit: (): void => {
            game.stop();
            game = newGame();
            canvas.hide();
            gameMenu.hide();
            mainMenu.show();
        }
    });

    let lastTime = 0;
    function animate(timeStamp: number): void {
        input.update();
        if (!game.running) {
            mainMenu.update(input);
        }
        else {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            if (game.paused) {
                gameMenu.update(input);
            }
            canvas.clear();
            game.update(input, { timeStamp, deltaTime });
            game.draw(canvas.context);
        }

        requestAnimationFrame(animate);
    }

    animate(0);
});