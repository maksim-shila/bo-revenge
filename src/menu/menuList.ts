import InputHandler from "../input.js";

export default class MenuList {

    private readonly menuButtons: HTMLButtonElement[];
    private activeBtn: HTMLButtonElement | null = null;
    private defaultBtn: HTMLButtonElement;

    constructor(menuButtons: HTMLButtonElement[], defaultBtn: HTMLButtonElement) {
        this.menuButtons = menuButtons;
        this.defaultBtn = defaultBtn;
        this.setActive(this.defaultBtn);
    }

    public update(input: InputHandler): void {
        this.changeActiveBtn(input);
        if (input.lockKeyPressed("select")) {
            this.activeBtn?.click();
            this.setActive(this.defaultBtn);
        }
    }

    public setActive(btn: HTMLButtonElement): void {
        if (this.activeBtn) {
            this.activeBtn.classList.remove("menu-item-active");
        }
        this.activeBtn = btn;
        btn.classList.add("menu-item-active");
    }

    private changeActiveBtn(input: InputHandler): void {
        if (!this.activeBtn) {
            this.activeBtn = this.menuButtons[0];
            return;
        }
        const upPressed = input.lockKeyPressed("up");
        const downPressed = input.lockKeyPressed("down");
        if (upPressed || downPressed) {
            const activeBtnIndex = this.menuButtons.indexOf(this.activeBtn);
            const newIndex = downPressed
                ? (activeBtnIndex + 1) % this.menuButtons.length
                : activeBtnIndex === 0 ? this.menuButtons.length - 1 : activeBtnIndex - 1;
            const activeBtn = this.menuButtons[newIndex];
            this.setActive(activeBtn);
        }
    }
}