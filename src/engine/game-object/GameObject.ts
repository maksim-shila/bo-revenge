import { Collider, Collision, FrameTimer, RigidBody } from "..";

export abstract class GameObject {

    private _collider: Collider | null = null;
    private _rigidBody: RigidBody | null = null;

    private _destroyActions: ((self: GameObject) => unknown)[] = [];
    private _destroyed = false;

    public vx = 0;
    public vy = 0;

    constructor(
        public readonly type: string,
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0
    ) { }

    public get collider(): Collider | null {
        return this._collider;
    }

    protected set collider(value: Collider | null) {
        this._collider = value;
    }

    public get rigidBody(): RigidBody | null {
        return this._rigidBody;
    }

    protected set rigidBody(value: RigidBody | null) {
        this._rigidBody = value;
    }

    public get onGround(): boolean {
        return this.rigidBody?.onGround ?? false;
    }

    public get weight(): number {
        return this.rigidBody?.weight ?? 0;
    }

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

    public abstract update(frameTimer: FrameTimer): void;
    public abstract draw(context: CanvasRenderingContext2D): void;

    public onCollisionEnter?(collision: Collision): void;
    public onCollisionExit?(collision: Collision): void;
}