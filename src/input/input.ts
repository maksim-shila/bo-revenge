import { KeyAction } from "./key-action.js";

export default abstract class Input<T> {

    private keys: T[] = [];
    private locked: T[] = [];

    /**
     * If key pressed - returns true only on first call.
     * Next calls returns false until key released and pressed again.
     * This rule also applied to keyPressed function.
     */
    public keyPressedOnce(action: KeyAction): boolean {
        if (this.keyPressed(action)) {
            const keys = this.getKeys(action);
            const lockKey = keys.find(key => this.keys.includes(key))!;
            this.locked.push(lockKey);
            return true;
        }
        return false;
    }

    public keyPressed(action: KeyAction): boolean {
        const keys = this.getKeys(action);
        return keys.some(key => this.keys.includes(key) && !this.locked.includes(key));
    }

    public keyReleased(action: KeyAction): boolean {
        const keys = this.getKeys(action);
        return !keys.some(key => this.keys.includes(key));
    }

    protected abstract getKeys(action: KeyAction): T[];

    protected onKeyDown = (key: T): void => {
        if (!this.keys.includes(key)) {
            this.keys.push(key);
        }
    };

    protected onKeyUp = (key: T): void => {
        this.keys = this.keys.filter(thisKey => thisKey !== key);
        this.locked = this.locked.filter(thisKey => thisKey !== key);
    };
}