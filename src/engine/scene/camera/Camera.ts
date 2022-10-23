import { GameObject } from "../../game-object/GameObject";

class DeadZone {
    constructor(
        public x = Number.NEGATIVE_INFINITY,
        public y = Number.NEGATIVE_INFINITY,
        public rx = Number.POSITIVE_INFINITY,
        public ry = Number.POSITIVE_INFINITY
    ) { }
}

export enum FollowStrategy {
    Centered
}

export class Camera {

    private _followed: GameObject | null = null;
    private _dx = 0;
    private _dy = 0;
    private _lastX = 0;
    private _lastY = 0;

    public deadZone: DeadZone = new DeadZone();
    public followStrategy: FollowStrategy = FollowStrategy.Centered;

    constructor(
        public x = 0,
        public y = 0,
        public readonly width = 0,
        public readonly height = 0
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
        return this.y + this.width * 0.5;
    }

    public get dx(): number {
        return this._dx;
    }

    public get dy(): number {
        return this._dy;
    }

    public update(): void {
        if (!this._followed) {
            return;
        }

        switch (this.followStrategy) {
            case FollowStrategy.Centered:
                this.x = this._followed.cx - this.width * 0.5;
                this.y = this._followed.cy - this.height * 0.5;
                break;
        }

        if (this.x < this.deadZone.x) this.x = this.deadZone.x;
        if (this.rx > this.deadZone.rx) this.x = this.deadZone.x - this.width;
        if (this.y < this.deadZone.y) this.y = this.deadZone.y;
        if (this.ry > this.deadZone.ry) this.y = this.deadZone.ry - this.height;

        this._dx = this.x - this._lastX;
        this._dy = this.y - this._lastY;
        this._lastX = this.x;
        this._lastY = this.y;
    }

    public follow(gameObject: GameObject): void {
        this._followed = gameObject;
    }
}