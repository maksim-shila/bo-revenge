import Game from "./game.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = 500;

    const context = canvas.getContext("2d")!;

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timeStamp: number): void {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(context);
        game.update(deltaTime);

        requestAnimationFrame(animate);
    }

    animate(0);
});