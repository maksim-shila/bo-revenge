import { Scene } from "../../../engine";

export default class ForestBackground {

    private readonly width: number;
    private readonly height: number;
    private readonly layers: Layer[];

    constructor(private readonly scene: Scene) {
        this.width = 1667;
        this.height = 500;
        this.layers = [
            new Layer(this.scene, this.width, this.height, 0, "forestImg_1"),
            new Layer(this.scene, this.width, this.height, 0.2, "forestImg_2"),
            new Layer(this.scene, this.width, this.height, 0.6, "forestImg_3"),
            new Layer(this.scene, this.width, this.height, 0.6, "forestImg_4")
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

    private readonly scale = 1.35;
    private readonly image: CanvasImageSource;
    private x: number;
    private y: number;

    constructor(
        private readonly scene: Scene,
        private readonly width: number,
        private readonly height: number,
        private readonly speedModifier: number,
        imageId: string
    ) {
        this.image = document.getElementById(imageId) as CanvasImageSource;
        this.x = 0;
        this.y = 0;
    }

    public update(): void {
        this.x -= Math.floor(this.scene.camera.dx * this.speedModifier);
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.drawImage(
            this.image,
            0,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale);
    }
}