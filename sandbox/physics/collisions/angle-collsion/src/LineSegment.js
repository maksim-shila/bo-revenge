export default class LineSegment {
    constructor(x1, y1, x2, y2) {
        // Normilize points for correct collisions handling
        if (x1 <= x2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        } else {
            this.x1 = x2;
            this.y1 = y2;
            this.x2 = x1;
            this.y2 = y1;
        }

        this.k = (this.y2 - this.y1) / (this.x2 - this.x1);
        this.b = this.y1 - this.k * this.x1;
    }

    crossPoint(other) {
        const isParallel = this.k === other.k;
        if (isParallel) {
            return { x: this.x1, y: this.y1, parallel: true }
        }

        const cross_x = (other.b - this.b) / (this.k - other.k);
        const cross_y = this.k * cross_x + this.b;
        if (this.hasPoint(cross_x, cross_y) && other.hasPoint(cross_x, cross_y)) {
            return { x: cross_x, y: cross_y, parallel: false };
        }

        return null;
    }

    hasPoint(x, y) {
        const targetY = this.k * x + this.b;
        if (targetY != y) {
            return false;
        }
        if ((this.x1 < x && this.x2 < x) ||
            (this.x1 > x && this.x2 > x) ||
            (this.y1 > y && this.y2 > y) ||
            (this.y1 < y && this.y2 < y)) {
            return false;
        } else {
            return true;
        }
    }
}