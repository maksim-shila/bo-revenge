import InputHandler from "./input.js";

export default class MainMenu {

    private readonly input: InputHandler;
    private readonly menu: HTMLElement;
    private readonly menuButtons: HTMLButtonElement[];
    private readonly startBtn: HTMLButtonElement;
    private onStartBtnClick: (() => unknown) | null = null;
    private activeBtn: HTMLButtonElement | null = null;
    private throttleTimer: NodeJS.Timeout | null = null;

    constructor(input: InputHandler) {
        this.input = input;
        this.menu = document.getElementById("mainMenu") as HTMLElement;
        this.startBtn = document.getElementById("mainMenu_start") as HTMLButtonElement;
        const controlsBtn = document.getElementById("mainMenu_controls") as HTMLButtonElement;
        const highscoresBtn = document.getElementById("mainMenu_highscores") as HTMLButtonElement;
        const exitBtn = document.getElementById("mainMenu_exit") as HTMLButtonElement;
        this.menuButtons = [this.startBtn, controlsBtn, highscoresBtn, exitBtn];
        this.setActive(this.startBtn);
    }

    public onStartNewGame(callback: () => unknown): void {
        if (this.onStartBtnClick) {
            this.startBtn.removeEventListener("click", this.onStartBtnClick);
        }
        this.onStartBtnClick = callback;
        this.startBtn.addEventListener("click", callback);
    }

    public show(): void {
        this.menu.style.display = "block";
    }

    public hide(): void {
        this.menu.style.display = "none";
        if (this.onStartBtnClick) {
            this.startBtn.removeEventListener("click", this.onStartBtnClick);
            this.onStartBtnClick = null;
        }
    }

    public update(): void {
        this.changeActiveBtn();
        if (this.input.keyPressed("select")) {
            this.activeBtn?.click();
        }
    }

    private changeActiveBtn(): void {
        if (!this.activeBtn) {
            this.activeBtn = this.menuButtons[0];
            return;
        }
        if (this.input.keyPressed("up", "down") && !this.throttleTimer) {
            const activeBtnIndex = this.menuButtons.indexOf(this.activeBtn);
            const newIndex = this.input.keyPressed("down")
                ? (activeBtnIndex + 1) % this.menuButtons.length
                : activeBtnIndex === 0 ? this.menuButtons.length - 1 : activeBtnIndex - 1;
            const activeBtn = this.menuButtons[newIndex];
            this.setActive(activeBtn);
            this.throttleTimer = setTimeout(() => this.throttleTimer = null, 200);
        } else if (this.input.keyReleased("up", "down") && this.throttleTimer) {
            clearTimeout(this.throttleTimer);
            this.throttleTimer = null;
        }
    }

    private setActive(btn: HTMLButtonElement): void {
        if (this.activeBtn) {
            this.activeBtn.classList.remove("menu-btn-active");
        }
        this.activeBtn = btn;
        btn.classList.add("menu-btn-active");
    }
}