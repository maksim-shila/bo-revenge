class Gamepad {

    constructor() {
        this.connected = false;
        this.axes = [];
        window.addEventListener("gamepadconnected", () => this.connected = true);
        window.addEventListener("gamepaddisconnected", () => this.connected = false);
    }

    update() {
        if (!this.connected) {
            return;
        }
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        this.axes = gamepad.axes;
    }
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;

const gamepad = new Gamepad();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gamepad.update();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 1, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.save();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 5;
    ctx.beginPath();
    const axeX = (gamepad.axes[0] ?? 0) * radius + centerX;
    const axeY = (gamepad.axes[1] ?? 0) * radius + centerY;
    ctx.arc(axeX, axeY, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.font = "16px serif";
    ctx.fillText(`x: ${axeX - centerX}`, 10, 50);
    ctx.fillText(`y: ${axeY - centerY}`, 10, 70);
    const length = Math.sqrt(gamepad.axes[0] * gamepad.axes[0] + gamepad.axes[1] * gamepad.axes[1]);
    ctx.fillText(`length: ${length}`, 10, 90);


    requestAnimationFrame(animate);
}

animate();