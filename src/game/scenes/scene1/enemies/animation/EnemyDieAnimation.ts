import { AnimationRow, Animator, FrameTimer, GameObject, Scene } from "../../../../../engine";

const Source = { imageId: "boomImg", width: 100, height: 90 };

export default class EnemyDieAnimation extends GameObject {

    constructor(scene: Scene, x: number, y: number) {
        const scale = Math.random() + 0.5;
        const width = Math.floor(Source.width * scale);
        const height = Math.floor(Source.height * scale);

        super("particle", scene, width, height);
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;

        this.animator = new Animator(Source.imageId, width, height, Source.width, Source.height);
        this.animator.fps = 15;
        this.animator.animation = new AnimationRow(0, 5);
    }

    public override update(frameTimer: FrameTimer): void {
        super.update(frameTimer);
        this.x += this.scene.vx;
        if (this.animator?.animation?.isMaxFrame) {
            this.destroy();
        }
    }
}