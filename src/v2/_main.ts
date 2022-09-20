import GameLoop from "./app/game-loop.js";

window.addEventListener("load", () => {
    const gameLoop = new GameLoop();
    gameLoop.run(0);
});