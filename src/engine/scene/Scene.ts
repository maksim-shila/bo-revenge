import { CollisionHandler, FrameTimer, GameObject, GameObjectContainer } from "..";

export class Scene {

    constructor(
        public readonly width: number,
        public readonly height: number
    ) { }

    private _objects: GameObject[] = [];
    private _containers: GameObjectContainer[] = [];
    private _colliders = new CollisionHandler();

    public get colliders(): CollisionHandler {
        return this._colliders;
    }

    public get sprites(): GameObject[] {
        return this._objects.filter(o => o.type !== "obstacle");
    }

    public get obstacles(): GameObject[] {
        return this._objects.filter(o => o.type === "obstacle");
    }

    public addObject(object: GameObject): void {
        this._objects.push(object);
        object.onDestroy(self => this._objects = this._objects.filter(o => o !== self));
        switch (object.type) {
            case "obstacle":
                this._colliders.watch(this.sprites, [object]);
                break;
            default:
                this._colliders.watch([object], this.obstacles);
                break;
        }
    }

    public addContainer(container: GameObjectContainer): void {
        this._containers.push(container);
        this._objects.push(...container.objects);
        container.onSpawn(object => this.addObject(object));
    }

    public update(frameTimer: FrameTimer): void {
        this._containers.forEach(container => container.update(frameTimer));
        this._objects.forEach(object => object.update(frameTimer));
        this._colliders.update();
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._objects.forEach(object => object.draw(context));
    }
}