import { Animator, Collider, Collision, CollisionDirection, FrameTimer, Global, Hitbox, RigidBody, Scene } from "..";

type Direction = "right" | "left" | "top" | "bottom";

export abstract class GameObject {

    public readonly GlobalType = "object";

    private _collider: Collider | null = null;
    private _rigidBody: RigidBody | null = null;
    private _animator: Animator | null = null;
    private _hitbox: Hitbox | null = null;

    private _destroyActions: ((self: GameObject) => unknown)[] = [];
    private _destroyed = false;

    public x = 0;
    public y = 0;
    public vx = 0;
    public vy = 0;
    public name = "unknown";

    constructor(
        public readonly type: string,
        public readonly scene: Scene,
        public width = 0,
        public height = 0
    ) { }

    public get hitbox(): Hitbox | null {
        return this._hitbox;
    }

    public set hitbox(value: Hitbox | null) {
        this._hitbox = value;
    }

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
            this._hitbox?.draw(context);
        }
    }

    public onCollisionEnter?(collision: Collision): void;
    public onCollision?(collision: Collision): void;
    public onObstacleCollisions?(directions: CollisionDirection[]): void;
    public onCollisionExit?(collision: Collision): void;

    public isOffscreen(...directions: Direction[]): boolean {
        const _isOffscreen = (direction: Direction): boolean => {
            switch (direction) {
                case "right":
                    return this.x > this.scene.width;
                case "left":
                    return this.x < 0 - this.width;
                case "bottom":
                    return this.y > this.scene.height;
                case "top":
                    return this.y < 0 - this.height;
            }
        };
        for (let i = 0; i < directions.length; ++i) {
            if (_isOffscreen(directions[i])) {
                return true;
            }
        }
        return false;
    }

    public isTouching(...directions: Direction[]): boolean {
        const _isTouching = (direction: Direction): boolean => {
            switch (direction) {
                case "right":
                    return this.x >= this.scene.width - this.width;
                case "left":
                    return this.x <= 0;
                case "bottom":
                    return this.y >= this.scene.height - this.height;
                case "top":
                    return this.y <= 0;
            }
        };
        for (let i = 0; i < directions.length; ++i) {
            if (_isTouching(directions[i])) {
                return true;
            }
        }
        return false;
    }

    public resetPosition(direction: Direction): void {
        switch (direction) {
            case "right":
                this.x = this.scene.width - this.width;
                this.vx = 0;
                break;
            case "left":
                this.x = 0;
                this.vx = 0;
                break;
            case "bottom":
                this.y = this.scene.height - this.height;
                this.vy = 0;
                break;
            case "top":
                this.y = 0;
                this.vy = 0;
                break;
        }
    }

    public disallowOffscreen(direction: Direction): void {
        if (this.isTouching(direction)) {
            this.resetPosition(direction);
        }
    }
}