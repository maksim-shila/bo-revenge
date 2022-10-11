import { Collider, Collision, GameObject } from "..";

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
            if (!pair.left.collider || !pair.right.collider) {
                return;
            }
            const collision = this.handle(pair.left.collider, pair.right.collider);
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

    private handle(left: Collider, right: Collider): Collision | null {
        const existing = this._collisions.find(collision => collision.containsBoth(left, right));
        if (existing) {
            if (!left.hasCollision(right)) {
                left.parent.onCollisionExit && left.parent.onCollisionExit(existing);
                right.parent.onCollisionExit && right.parent.onCollisionExit(existing);
                return null;
            }
            const newCollision = new Collision(left, right);
            if (existing.direction !== newCollision.direction) {
                left.parent.onCollisionExit && left.parent.onCollisionExit(existing);
                left.parent.onCollisionEnter && left.parent.onCollisionEnter(newCollision);
                right.parent.onCollisionExit && right.parent.onCollisionExit(existing);
                right.parent.onCollisionEnter && right.parent.onCollisionEnter(newCollision);
                return newCollision;
            } else {
                left.parent.onCollision && left.parent.onCollision(existing);
                right.parent.onCollision && right.parent.onCollision(existing);
                return existing;
            }
        } else if (left.hasCollision(right)) {
            const collision = new Collision(left, right);
            left.parent.onCollisionEnter && left.parent.onCollisionEnter(collision);
            right.parent.onCollisionEnter && right.parent.onCollisionEnter(collision);
            return collision;
        }
        return null;
    }

    private handlePhysics() {
        const rigid = this._watchObjects
            .filter(obj => obj.rigidBody !== null && obj.collider !== null)
            .map(obj => obj.collider) as Collider[];
        rigid.forEach(collider => {
            const collisions = this._collisions.filter(c => c.left === collider && c.right.parent.type === "obstacle");
            const directions = collisions.map(collision => {
                const direction = collision.direction;
                const obstacle = collision.right;
                switch (direction) {
                    case "left":
                        collider.x = Math.ceil(obstacle.rx);
                        break;
                    case "right":
                        collider.x = Math.ceil(obstacle.x - collider.width);
                        break;
                    case "top":
                        collider.y = Math.ceil(obstacle.ry);
                        break;
                    case "bottom":
                        collider.y = Math.ceil(obstacle.y - collider.height);
                        break;
                }
                return direction;
            });

            const sprite = collider.parent;
            if (directions.some(d => d === "bottom") && sprite.vy >= 0) {
                sprite.rigidBody!.onGround = true;
                sprite.vy = 0;
            } else {
                sprite.rigidBody!.onGround = false;
            }

            sprite.onObstacleCollisions && sprite.onObstacleCollisions(directions);
        });
    }
}