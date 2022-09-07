window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = 600;
    canvas.height = 600;

    const context = canvas.getContext("2d")!;

    let x = 0;
    let y = 0;
    const size = 100;
    let speedX = 6;
    let speedY = 5;
    const image = document.getElementById("playerImg") as CanvasImageSource;
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, x, y, size, size);
        x += speedX;
        y += speedY;
        if (x >= canvas.width - size || x <= 0) {
            speedX = -speedX;
        }
        if (y >= canvas.height - size || y <= 0) {
            speedY = -speedY;
        }
        requestAnimationFrame(animate);
    }

    animate();
});