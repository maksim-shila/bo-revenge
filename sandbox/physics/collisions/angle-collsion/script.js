import Platform from "./src/Platform.js";
import Player from "./src/Player.js";
import Input from "../../../common/Input.js";

function createPlatforms() {
    const platforms = [];
    let angle = Math.PI / 3;
    let x = 100;
    let y = 100;
    const width = 100;
    const height = 50;
    const angleDelta = Math.PI / 18;

    for (let i = 0; i < 12; ++i) {
        platforms.push(new Platform(x, y, width, height, angle, i + 1));
        x += Math.floor(Math.cos(angle) * width);
        y += Math.floor(Math.sin(angle) * width);
        angle = angle - angleDelta;
        if (angle < 0) {
            angle = 0;
        }
    }

    return platforms;
}

function hasCollision(player, platform) {
    return platform.x <= player.x + player.width &&
        platform.x + platform.width >= player.x &&
        platform.y <= player.y + player.height &&
        platform.y + platform.height >= player.y;
}

function checkCollisions(player, platforms) {
    for (let i = 0; i < platforms.length; ++i) {
        const platform = platforms[i];
        if (hasCollision(player, platform)) {
            const crossPoint = player.collider().crossPoint(platform.collider);
            if (crossPoint && !crossPoint.parallel) {
                const deltaY = (player.x - crossPoint.x) * Math.tan(platform.angle);
                player.y += deltaY;
                player.onGround = true;
                player.vy = 0;
                break;
            } else if (crossPoint && crossPoint.parallel) {
                player.y = platform.y - player.height;
                player.onGround = true;
                player.vy = 0;
                break;
            }
        } else {
            player.onGround = false;
        }
    }
}

window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas1");
    const context = canvas.getContext("2d");
    canvas.width = 1600;
    canvas.height = 600;

    const platforms = createPlatforms();
    const player = new Player(new Input(), 500, 200);

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        platforms.forEach(platform => platform.draw(context));
        player.update();
        checkCollisions(player, platforms);

        player.draw(context);
        requestAnimationFrame(animate);
    }

    animate();
});