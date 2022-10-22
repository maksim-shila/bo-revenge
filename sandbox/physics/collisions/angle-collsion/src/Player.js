import LineSegment from "./LineSegment.js";

export default class Player {

    constructor(input, x, y) {
        this.input = input;
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.vx = 0;
        this.width = 100;
        this.height = 50;
        this.angle = 0;

        this.onGround = false;

        this.weight = 2;
        this.speed = 5;
    }

    collider() {
        const x1 = this.x - Math.cos(Math.PI * 0.5 - this.angle) * this.height;
        const y1 = this.y + Math.sin(Math.PI * 0.5 - this.angle) * this.height;
        const x2 = x1 + Math.sin(Math.PI * 0.5 - this.angle) * this.width;
        const y2 = y1 + Math.cos(Math.PI * 0.5 - this.angle) * this.width;
        return new LineSegment(x1, y1, x2, y2);
    }

    update() {
        if (this.input.keyPressed("KeyD")) {
            this.x += this.speed
        } else if (this.input.keyPressed("KeyA")) {
            this.x -= this.speed
        }

        if (this.input.keyPressed("Space") && this.onGround) {
            this.vy = -20;
        }

        if (!this.onGround) {
            this.vy += this.weight;
        }

        this.y += this.vy;
    }

    draw(context) {
        context.save();

        context.translate(this.x, this.y);
        context.rotate(this.angle);

        // draw player
        context.fillStyle = "green";
        context.fillRect(0, 0, this.width, this.height);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeRect(0, 0, this.width, this.height);

        context.restore();

        // draw collider
        const collider = this.collider();
        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(collider.x1, collider.y1);
        context.lineTo(collider.x2, collider.y2);
        context.stroke();
    }
}