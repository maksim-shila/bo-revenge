import * as Bad from "bad-engine";

const Source = { imageId: "boomImg", width: 100, height: 90 };

export default class EnemyDieAnimation extends Bad.GameObject {

    constructor(scene: Bad.Scene, x: number, y: number) {
        const scale = Math.random() + 0.5;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super("particle", scene, width, height);
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;

        this.animator = new Bad.Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 15;
        this.animator.animation = new Bad.AnimationRow(0, 5);
    }

    public override update(frame: Bad.Frame): void {
        super.update(frame);
        if (this.animator?.animation?.isMaxFrame) {
            this.destroy();
        }
    }
}