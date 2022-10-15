import GameObject from "./GameObject";

export default class Colliders {

    private readonly colliders: { left: GameObject[], right: GameObject[] }[] = [];

    public add(left: GameObject[], right: GameObject[]) {
        this.colliders.push({ left, right });
    }

    public update() {
        this.colliders.forEach(pair => {
            for (let i = 0; i < pair.left.length; ++i) {
                const left = pair.left[i];
                if (!left.collider) {
                    continue;
                }
                for (let j = 0; j < pair.right.length; ++j) {
                    const right = pair.right[j];
                    if (!right.collider) {
                        continue;
                    }
                    if (left.collider.hasCollision(right.collider)) {
                        left.onCollisionEnter(right);
                        right.onCollisionEnter(left);
                    }
                }
            }
        })
    }
}