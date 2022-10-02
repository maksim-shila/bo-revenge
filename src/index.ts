import Game from "./game/game";
import GameConfig from "./global";
import MainMenu from "./menu/mainMenu";
import GameMenu from "./game/gameMenu";
import Canvas from "./utils/canvas";
import InputHandler from "./input/input-handler";

window.addEventListener("load", () => {

    const gameConfig = new GameConfig();
    const input = new InputHandler(gameConfig);
    const canvas = new Canvas(gameConfig);
    let game = newGame();

    function newGame(): Game {
        const game = new Game(gameConfig);
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