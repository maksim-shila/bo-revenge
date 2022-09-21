export default class Timer {
    private readonly callback: () => unknown;
    private readonly interval: () => number;
    private timer: number;
    private currentInterval: number;

    constructor(callback: () => unknown, interval: () => number) {
        this.callback = callback;
        this.interval = interval;
        this.currentInterval = this.interval();
        this.timer = 0;
    }

    public update(deltaTime: number): void {
        if (this.timer > this.currentInterval) {
            this.callback();
            this.currentInterval = this.interval();
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
    }
}