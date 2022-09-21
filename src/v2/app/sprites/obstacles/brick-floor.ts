import Painter from "../../core/animation/painter.js";
import Dimension from "../../core/dimension.js";
import Game from "../../game.js";
import ObstacleContainer from "./obstacle-container.js";
import Obstacle from "./obstacle.js";

export default class BrickFloor implements ObstacleContainer {
    private readonly _game: Game;
    private _obstacles: Obstacle[];
    private _partsCount: number;

    public readonly height: number;

    constructor(game: Game) {
        this._game = game;
        const partDimension = new Dimension({ sw: 6946, sh: 354, scale: 0.2 });
        this.height = partDimension.height;
        const spawnY = game.height - partDimension.height;
        this._partsCount = Math.ceil(this._game.width / partDimension.width) + 1;
        this._obstacles = [];
        for (let i = 0; i < this._partsCount; ++i) {
            const spawnX = partDimension.width * i;
            const part = new BrickFloorPart(this._game, spawnX, spawnY, partDimension);
            this._obstacles.push(part);
        }
    }

    public get obstacles(): Obstacle[] {
        return this._obstacles;
    }

    update(): void {
        this._obstacles.forEach(obstacle => {
            obstacle.update();
            if (obstacle.x < -obstacle.width) {
                obstacle.x = obstacle.x + obstacle.width * this._partsCount;
            }
        });
    }

    draw(context: CanvasRenderingContext2D): void {
        this._obstacles.forEach(o => o.draw(context));
    }
}

class BrickFloorPart extends Obstacle {

    private readonly _game: Game;
    private readonly _painter: Painter;

    constructor(game: Game, spawnX: number, spawnY: number, dimension: Dimension) {
        super("obstacle", game, spawnX, spawnY, dimension);
        this._game = game;
        this._painter = new Painter(this, "brickFloorImg", dimension, game.globalConfig);
    }

    public update(): void {
        this.x -= this._game.speed;
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._painter.draw(context);
    }
}