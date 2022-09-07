import Game from "./game.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = 500;
    canvas.height = 500;

    const context = canvas.getContext("2d")!;

    const game = new Game(canvas.width, canvas.height);
    function animate(): void {
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(context);
        game.update();

        requestAnimationFrame(animate);
    }

    animate();
});