export default class Input {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", e => {
            if (!this.keys.includes(e.code)) {
                this.keys.push(e.code);
            }
        });
        window.addEventListener("keyup", e => {
            const i = this.keys.indexOf(e.code);
            if (i >= 0) {
                this.keys.splice(i, 1);
            }
        })
    }

    keyPressed(code) {
        return this.keys.includes(code);
    }

    keyReleased(code) {
        return !this.keys.includes(code);
    }
}