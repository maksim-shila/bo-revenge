import { FrameTimer, Scene } from "..";

export abstract class GameObjectContainer {

    public readonly GlobalType = "container";

    constructor(protected readonly scene: Scene) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(frameTimer: FrameTimer): void { }
}