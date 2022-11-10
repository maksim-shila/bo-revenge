import * as Bad from "bad-engine";

export default class ForestBackground {

    private readonly layers: Layer[];

    constructor(private readonly scene: Bad.Scene) {
        this.layers = [
            new Layer(this.scene, 0.7, "forestImg_1"),
            new Layer(this.scene, 0.8, "forestImg_2"),
            new Layer(this.scene, 1, "forestImg_3"),
            new Layer(this.scene, 1, "forestImg_4")
        ];
    }

    update(): void {
        this.layers.forEach(l => l.update());
    }

    draw(context: CanvasRenderingContext2D): void {
        this.layers.forEach(l => l.draw(context));
    }
}

const Source = { width: 1667, height: 500, scale: 1.35 };
class Layer {

    private readonly image: CanvasImageSource;
    private readonly width: number;
    private readonly height: number;
    private x: number;
    private y: number;

    constructor(
        private readonly scene: Bad.Scene,
        private readonly speedModifier: number,
        imageId: string
    ) {
        this.image = document.getElementById(imageId) as CanvasImageSource;
        this.width = Source.width * Source.scale;
        this.height = Source.height * Source.scale;
        this.x = this.scene.camera.x;
        this.y = 0;
    }

    public update(): void {
        this.x = -1 * (this.scene.camera.x % (this.width / this.speedModifier)) * this.speedModifier;
    }

    public draw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < Math.ceil(this.scene.width / this.width) + 1; ++i) {
            context.drawImage(
                this.image,
                0,
                0,
                Source.width,
                Source.height,
                this.x + this.width * i - i,
                this.y,
                this.width,
                this.height);
        }
    }
}