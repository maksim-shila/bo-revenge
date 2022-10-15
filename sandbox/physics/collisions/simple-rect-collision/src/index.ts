import Colliders from "./scripts/Colliders";
import GameMap from "./scripts/GameMap";
import Input from "./scripts/input";
import Player from "./scripts/player";

const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;
const context = canvas.getContext("2d")!;

const player = new Player(canvas);
const input = new Input();
const map = new GameMap();

const colliders = new Colliders();
colliders.add([player], map.tiles);

function gameLoop() {
    requestAnimationFrame(gameLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.update(input);
    colliders.update();

    map.draw(context);
    player.draw(context);
}

gameLoop();