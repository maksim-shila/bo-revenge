import InputHandler from "../input.js";

export default class MenuList {

    private readonly menuButtons: HTMLButtonElement[];
    private readonly changeSound: HTMLAudioElement;
    private readonly selectSound: HTMLAudioElement;
    private activeBtn: HTMLButtonElement | null = null;
    private defaultBtn: HTMLButtonElement;

    constructor(menuButtons: HTMLButtonElement[], defaultBtn: HTMLButtonElement) {
        this.menuButtons = menuButtons;
        this.menuButtons.forEach(btn => btn.addEventListener("click", () => this.playSelectSound()));
        this.changeSound = new Audio();
        this.changeSound.src = "assets/sounds/menu_change.mp3";
        this.selectSound = new Audio();
        this.selectSound.src = "assets/sounds/menu_select.mp3";
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
            this.playChangeSound();
        }
    }

    private playChangeSound(): void {
        if (!this.changeSound.paused) {
            this.changeSound.pause();
            this.changeSound.currentTime = 0;
        }
        this.changeSound.play();
    }

    private playSelectSound(): void {
        if (!this.selectSound.paused) {
            this.selectSound.pause();
            this.selectSound.currentTime = 0;
        }
        this.selectSound.play();
    }
}