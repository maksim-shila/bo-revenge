import { Collider } from "../collision/Collider";
import Collision from "../collision/Collision";

export default abstract class GameObject {

    public vx = 0;
    public vy = 0;
    public collider: Collider | null = null;

    private _destroyActions: ((self: GameObject) => unknown)[] = [];
    private _destroyed = false;

    constructor(
        public readonly type: string,
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0
    ) { }

    public get rx(): number {
        return this.x + this.width;
    }

    public get ry(): number {
        return this.y + this.height;
    }

    public get cx(): number {
        return this.x + this.width * 0.5;
    }

    public get cy(): number {
        return this.y + this.height * 0.5;
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public onDestroy(callback: (self: GameObject) => unknown): void {
        this._destroyActions.push(callback);
    }

    public destroy(): void {
        this._destroyed = true;
        this._destroyActions.forEach(action => action(this));
    }

    public onCollisionEnter?(collision: Collision): void;
    public onCollisionExit?(collision: Collision): void;
}