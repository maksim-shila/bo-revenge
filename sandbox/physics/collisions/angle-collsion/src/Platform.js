import LineSegment from "./LineSegment.js";

export default class Platform {
    constructor(x, y, width, height, angle, index) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.index = index;
        this.collider = new LineSegment(
            this.x,
            this.y,
            this.x + Math.cos(this.angle) * this.width,
            this.y + Math.sin(this.angle) * this.width);
    }

    draw(context) {
        // draw platform
        context.save();

        context.translate(this.x, this.y);
        context.rotate(this.angle);

        context.fillStyle = "black";
        context.fillRect(0, 0, this.width, this.height);

        context.strokeStyle = "lightgrey";
        context.lineWidth = 1;
        context.strokeRect(0, 0, this.width, this.height);

        context.fillStyle = "white";
        context.font = '24px Helvetica';
        context.fillText(`${this.index}`, this.width * 0.5 - 8, this.height * 0.5 + 10)
        context.restore();

        // draw collider
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(this.collider.x1, this.collider.y1);
        context.lineTo(this.collider.x2, this.collider.y2);
        context.stroke();
    }
}