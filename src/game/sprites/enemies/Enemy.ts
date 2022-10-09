import { GameObject, Scene } from "../../../engine";
import EnemyDieAnimation from "./EnemyDieAnimation";

export abstract class Enemy extends GameObject {

    constructor(scene: Scene, width: number, height: number, type = "enemy") {
        super(type, scene, width, height);
    }

    public die() {
        this.scene.add(new EnemyDieAnimation(this.scene, this.cx, this.cy));
        this.destroy();
    }
}