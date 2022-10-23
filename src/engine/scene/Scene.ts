import { CollisionHandler, FrameTimer, GameObject, GameObjectContainer, Camera } from "..";

export abstract class Scene {

    private _objects: GameObject[] = [];
    private _containers: GameObjectContainer[] = [];
    private _colliders = new CollisionHandler();
    private _camera: Camera;

    public vx = 0;
    public vx_default = 0;

    constructor(
        public readonly width: number,
        public readonly height: number
    ) {
        this._camera = new Camera(0, 0, width, height);
    }

    public get colliders(): CollisionHandler {
        return this._colliders;
    }

    public get particles(): GameObject[] {
        return this._objects.filter(o => o.type === "particle");
    }

    public get camera(): Camera {
        return this._camera;
    }

    protected set camera(value: Camera) {
        this._camera = value;
    }

    public get sprites(): GameObject[] {
        return this._objects.filter(o => ["enemy", "player"].includes(o.type));
    }

    public get obstacles(): GameObject[] {
        return this._objects.filter(o => o.type === "obstacle");
    }

    public add(object: GameObject | GameObjectContainer): void {
        switch (object.GlobalType) {
            case "object":
                this.addObject(object);
                break;
            case "container":
                this.addContainer(object);
                break;
        }
    }

    public addObject(object: GameObject): void {
        this._objects.push(object);
        object.onDestroy(self => this._objects = this._objects.filter(o => o !== self));
        switch (object.type) {
            case "obstacle":
                this._colliders.watch(this.sprites, [object]);
                break;
            default:
                if (object.rigidBody) {
                    this._colliders.watch([object], this.obstacles);
                }
                break;
        }
    }

    public addContainer(container: GameObjectContainer): void {
        this._containers.push(container);
    }

    public update(frameTimer: FrameTimer): void {
        this._containers.forEach(container => container.update(frameTimer));
        this._objects.forEach(object => object.update(frameTimer));
        this._colliders.update();
        this._camera.update();
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._objects.forEach(object => object.draw(context));
    }

    public destroy() {
    }
}