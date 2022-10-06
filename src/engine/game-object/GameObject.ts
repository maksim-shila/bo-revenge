import { Animator, Collider, Collision, CollisionDirection, FrameTimer, Global, RigidBody } from "..";

export abstract class GameObject {

    private _collider: Collider | null = null;
    private _rigidBody: RigidBody | null = null;
    private _animator: Animator | null = null;

    private _destroyActions: ((self: GameObject) => unknown)[] = [];
    private _destroyed = false;

    public vx = 0;
    public vy = 0;
    public name = "unknown";

    constructor(
        public type: string,
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

    public get animator(): Animator | null {
        return this._animator;
    }

    protected set animator(value: Animator | null) {
        this._animator = value;
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

    public update(frameTimer: FrameTimer): void {
        this._animator?.update(frameTimer);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._animator?.draw(context, this.x, this.y);
        if (Global.debug) {
            this._collider?.draw(context);
        }
    }

    public onCollisionEnter?(collision: Collision): void;
    public onCollision?(collision: Collision): void;
    public onObstacleCollisions?(directions: CollisionDirection[]): void;
    public onCollisionExit?(collision: Collision): void;
}