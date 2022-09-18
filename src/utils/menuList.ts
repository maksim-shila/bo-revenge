import InputHandler from "../input";

export default class MenuList {

    private readonly menuButtons: HTMLButtonElement[];
    private activeBtn: HTMLButtonElement | null = null;
    private throttleTimer: NodeJS.Timeout | null = null;

    constructor(menuButtons: HTMLButtonElement[]) {
        this.menuButtons = menuButtons;
    }

    public update(input: InputHandler): void {
        this.changeActiveBtn(input);
        if (input.keyPressed("select")) {
            this.activeBtn?.click();
        }
    }

    public setActive(btn: HTMLButtonElement): void {
        if (this.activeBtn) {
            this.activeBtn.classList.remove("menu-btn-active");
        }
        this.activeBtn = btn;
        btn.classList.add("menu-btn-active");
    }

    private changeActiveBtn(input: InputHandler): void {
        if (!this.activeBtn) {
            this.activeBtn = this.menuButtons[0];
            return;
        }
        if (input.keyPressed("up", "down") && !this.throttleTimer) {
            const activeBtnIndex = this.menuButtons.indexOf(this.activeBtn);
            const newIndex = input.keyPressed("down")
                ? (activeBtnIndex + 1) % this.menuButtons.length
                : activeBtnIndex === 0 ? this.menuButtons.length - 1 : activeBtnIndex - 1;
            const activeBtn = this.menuButtons[newIndex];
            this.setActive(activeBtn);
            this.throttleTimer = setTimeout(() => this.throttleTimer = null, 200);
        } else if (input.keyReleased("up", "down") && this.throttleTimer) {
            clearTimeout(this.throttleTimer);
            this.throttleTimer = null;
        }
    }
}