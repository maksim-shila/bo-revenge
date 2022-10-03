import { Collision, GameObject } from "..";

type WatchPair = { left: GameObject, right: GameObject };

export class CollisionHandler {

    private _watchObjects: GameObject[] = [];
    private _watchPairs: WatchPair[] = [];
    private _collisions: Collision[] = [];

    public get watchObjects(): GameObject[] {
        return this._watchObjects;
    }

    public get watchPairs(): WatchPair[] {
        return this._watchPairs;
    }

    public get collisions(): Collision[] {
        return this._collisions;
    }

    public watch(leftSet: GameObject[], rightSet: GameObject[]): void {
        leftSet.forEach(left => {
            rightSet.forEach(right => {
                this._watchPairs.push({ left, right });
                this.watchObject(left);
                this.watchObject(right);
            });
        });
    }

    public remove(gameObject: GameObject): void {
        this._watchPairs = this._watchPairs.filter(pair =>
            pair.left !== gameObject &&
            pair.right !== gameObject
        );
        this._watchObjects = this._watchObjects.filter(o => o !== gameObject);
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
        this.handlePhysics();
    }

    private watchObject(gameObject: GameObject) {
        if (!this._watchObjects.includes(gameObject)) {
            this._watchObjects.push(gameObject);
            gameObject.onDestroy(o => this.remove(o));
        }
    }

    private handle(left: GameObject, right: GameObject): Collision | null {
        if (left.collider === null || right.collider === null) {
            return null;
        }
        const existing = this._collisions.find(collision => collision.containsBoth(left, right));
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

    private handlePhysics() {
        const rigidObjects = this._watchObjects.filter(obj => obj.rigidBody !== null);
        rigidObjects.forEach(sprite => {
            const collisions = this._collisions.filter(c => c.left === sprite && c.right.type === "obstacle");
            const directions = collisions.map(collision => {
                const direction = collision.direction;
                const obstacle = collision.right;
                switch (direction) {
                    case "left":
                        sprite.x = obstacle.rx;
                        break;
                    case "right":
                        sprite.x = obstacle.x - sprite.width;
                        break;
                    case "top":
                        sprite.y = obstacle.ry;
                        break;
                    case "bottom":
                        sprite.y = obstacle.y - sprite.height;
                        break;
                }
                return direction;
            });
            sprite.rigidBody!.onGround = directions.some(d => d === "bottom");
        });
    }
}