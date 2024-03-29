import * as Bad from "bad-engine";

export default class Background {

    private readonly width: number;
    private readonly height: number;
    private readonly layers: Layer[];

    constructor(private readonly scene: Bad.Scene) {
        this.width = 1667;
        this.height = 500;
        this.layers = [
            new Layer(this.scene, this.width, this.scene.height, 0, "backgroundCityImg_1"),
            new Layer(this.scene, this.width, this.height, 0.2, "backgroundCityImg_2"),
            new Layer(this.scene, this.width, this.height, 0.4, "backgroundCityImg_3"),
            new Layer(this.scene, this.width, this.height, 0.6, "backgroundCityImg_4")
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

    private readonly image: CanvasImageSource;
    private x: number;
    private y: number;

    constructor(
        private readonly scene: Bad.Scene,
        private readonly width: number,
        private readonly height: number,
        private readonly speedModifier: number,
        imageId: string
    ) {
        this.image = document.getElementById(imageId) as CanvasImageSource;
        this.x = 0;
        this.y = this.scene.height - this.height;
    }

    public update(): void {
        this.x = -1 * (this.scene.camera.x % (this.width / this.speedModifier)) * this.speedModifier;
    }

    public draw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < Math.ceil(this.scene.width / this.width) + 1; ++i) {
            context.drawImage(
                this.image,
                this.x + this.width * i - i,
                this.y,
                this.width,
                this.height);
        }
    }
}