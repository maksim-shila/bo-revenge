import GameObject from "../game-object/GameObject";
import Collision from "./Collision";

type WatchPair = { left: GameObject, right: GameObject };

export default class CollisionHandler {

    private _watchPairs: WatchPair[] = [];
    private _collisions: Collision[] = [];

    public get watchPairs(): WatchPair[] {
        return this._watchPairs;
    }

    public get collisions(): Collision[] {
        return this._collisions;
    }

    public add(leftSet: GameObject[], rightSet: GameObject[]): void {
        leftSet.forEach(left => {
            rightSet.forEach(right => {
                this._watchPairs.push({ left, right });
                left.onDestroy((gameObject) => this.remove(gameObject));
                right.onDestroy((gameObject) => this.remove(gameObject));
            });
        });
    }

    public remove(gameObject: GameObject): void {
        this._watchPairs = this._watchPairs.filter(pair =>
            pair.left !== gameObject &&
            pair.right !== gameObject
        );
    }

    public update(): void {
        const collisions: Collision[] = [];
        this._watchPairs.forEach(pair => {
            const collision = this.handle(pair.left, pair.right);
            if (collision) {
                collisions.push(collision);
            }
        });
        this._collisions = collisions;
    }

    private handle(left: GameObject, right: GameObject): Collision | null {
        if (left.collider === null || right.collider === null) {
            return null;
        }
        const existing = this._collisions.find(collision => left === collision.left && right === collision.right);
        if (existing) {
            if (left.collider.hasCollision(right.collider)) {
                return existing;
            } else {
                left.onCollisionExit && left.onCollisionExit(existing);
                right.onCollisionExit && right.onCollisionExit(existing);
                return null;
            }
        } else if (left.collider.hasCollision(right.collider)) {
            const collision = new Collision(left, right);
            left.onCollisionEnter && left.onCollisionEnter(collision);
            right.onCollisionEnter && right.onCollisionEnter(collision);
            return collision;
        }
        return null;
    }
}