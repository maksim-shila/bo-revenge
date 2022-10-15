export default class Input {
    public keys: string[] = [];

    constructor() {
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

    public keyPressed(code: string): boolean {
        return this.keys.includes(code);
    }

    public keyReleased(code: string): boolean {
        return !this.keys.includes(code);
    }
}