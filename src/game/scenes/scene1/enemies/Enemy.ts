import * as Bad from "bad-engine";
import EnemyDieAnimation from "./animation/EnemyDieAnimation";

export abstract class Enemy extends Bad.GameObject {

    constructor(scene: Bad.Scene, width: number, height: number, type = "enemy") {
        super(type, scene, width, height);
    }

    public die() {
        this.scene.add(new EnemyDieAnimation(this.scene, this.cx, this.cy));
        this.destroy();
    }
}