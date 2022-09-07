window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = 600;
    canvas.height = 600;

    const context = canvas.getContext("2d")!;

    let x = 0;
    let speed = 10;
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(x, 50, 100, 100);
        x += speed;
        if (x >= canvas.width - 100 || x <= 0) {
            speed = -speed;
        }
        requestAnimationFrame(animate);
    }

    animate();
});