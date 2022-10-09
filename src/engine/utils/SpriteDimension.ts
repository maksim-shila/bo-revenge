export default class SpriteDimension {

    public readonly image: CanvasImageSource;

    constructor(
        public readonly imageId: string,
        public readonly sw: number,
        public readonly sh: number,
        public readonly scale: number
    ) {
        this.image = document.getElementById(imageId) as CanvasImageSource;
    }

    public get width(): number {
        return Math.floor(this.sw * this.scale);
    }

    public get height(): number {
        return Math.floor(this.sh * this.scale);
    }
}