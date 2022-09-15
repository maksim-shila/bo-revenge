import Game from "./game.js";

export default class Background {

    private readonly game: Game;
    private readonly width: number;
    private readonly height: number;
    private readonly layers: Layer[];

    constructor(game: Game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layers = [
            new Layer(this.game, this.width, this.height, 0, "backgroundCityImg_1"),
            new Layer(this.game, this.width, this.height, 0.2, "backgroundCityImg_2"),
            new Layer(this.game, this.width, this.height, 0.4, "backgroundCityImg_3"),
            new Layer(this.game, this.width, this.height, 0.6, "backgroundCityImg_4"),
            new Layer(this.game, this.width, this.height, 1, "backgroundCityImg_5"),
        ];
    }

    update(): void {
        this.layers.forEach(l => l.update());
    }

    draw(context: CanvasRenderingContext2D): void {
        this.layers.forEach(l => l.draw(context));
    }
}

class Layer {

    private readonly game: Game;
    private readonly width: number;
    private readonly height: number;
    private readonly speedModifier: number;
    private readonly image: CanvasImageSource;
    private x: number;
    private y: number;

    constructor(game: Game, width: number, height: number, speedModifier: number, imageId: string) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = document.getElementById(imageId) as CanvasImageSource;
        this.x = 0;
        this.y = 0;
    }

    public update(): void {
        if (this.x <= -this.width + this.game.speed) {
            this.x = 0;
        } else {
            this.x -= this.game.speed * this.speedModifier;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}