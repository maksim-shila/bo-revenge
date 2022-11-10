import * as Bad from "bad-engine";
import { RectCollider } from "bad-engine";

const Source = {
    imageId: "spikeImg",
    width: 116,
    height: 78
};

export default class SpikeWall extends Bad.GameObject {
    private readonly _totalSpikes = 15;
    private spikes: Spike[];

    constructor(scene: Bad.Scene) {
        super("spikeWall", scene);
        const spikeHeight = scene.height / this._totalSpikes;
        const spikeScale = spikeHeight / Source.height;
        const spikeWidth = spikeScale * Source.width;
        this.width = spikeWidth;
        this.height = spikeHeight * this._totalSpikes;
        this.spikes = [];
        for (let i = 0; i < this._totalSpikes; ++i) {
            const spike = new Spike(this.scene, 0, i * spikeHeight, spikeWidth, spikeHeight);
            this.spikes.push(spike);
        }
        this.collider = new RectCollider(this);
    }

    public override update(frame: Bad.Frame): void {
        this.x = this.scene.camera.x;
        this.spikes.forEach(spike => spike.update(frame));
    }

    public override draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
        this.spikes.forEach(spike => spike.draw(context));
    }
}

class Spike extends Bad.GameObject {
    constructor(scene: Bad.Scene, x: number, y: number, width: number, height: number) {
        super("spike", scene, width, height);
        this.x = x;
        this.y = y;
        this.animator = new Bad.Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 20;
        this.animator.animation = new Bad.AnimationRow(0, 4);
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        this.x = this.scene.camera.x;
    }
}