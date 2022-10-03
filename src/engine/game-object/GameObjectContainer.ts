import { FrameTimer, GameObject } from "..";

export abstract class GameObjectContainer {

    private _objects: GameObject[] = [];
    private _onSpawn: ((object: GameObject) => unknown)[] = [];

    public get objects(): GameObject[] {
        return this._objects;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(frameTimer: FrameTimer): void {
        this._objects = this._objects.filter(obj => !obj.destroyed);
    }

    public spawn(object: GameObject) {
        this._objects.push(object);
        this._onSpawn.forEach(callback => callback(object));
    }

    public onSpawn(callback: (object: GameObject) => unknown): void {
        this._onSpawn.push(callback);
    }

    protected remove(object: GameObject): void {
        this._objects = this._objects.filter(o => o !== object);
    }
}