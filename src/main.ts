import Game from "./game/game.js";
import InputHandler from "./input.js";
import GameConfig from "./global.js";
import MainMenu from "./mainMenu.js";

window.addEventListener("load", () => {

    const gameConfig = new GameConfig();
    const input = new InputHandler(gameConfig);

    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    canvas.width = gameConfig.width;
    canvas.height = gameConfig.height;

    let gameStarted = false;
    const mainMenu = new MainMenu(input);
    mainMenu.onStartNewGame(() => {
        gameStarted = true;
        mainMenu.hide();
        canvas.style.display = "block";
    });
    const game = new Game(gameConfig, input);

    let lastTime = 0;
    function animate(timeStamp: number): void {
        input.update();
        if (!gameStarted) {
            mainMenu.show();
            mainMenu.update();
        } else {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            context.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(context);
        }

        requestAnimationFrame(animate);
    }

    animate(0);
});