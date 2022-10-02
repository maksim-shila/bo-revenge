import InputHandler from "../input/input-handler";

export default class MenuList {

    private readonly menuButtons: HTMLButtonElement[];
    private readonly changeSound: HTMLAudioElement;
    private readonly selectSound: HTMLAudioElement;
    private activeBtn: HTMLButtonElement | null = null;
    private defaultBtn: HTMLButtonElement;

    constructor(menuButtons: HTMLButtonElement[], defaultBtn: HTMLButtonElement) {
        this.menuButtons = menuButtons;
        this.menuButtons.forEach(btn => btn.addEventListener("click", () => this.playSelectSound()));
        this.changeSound = document.getElementById("menuChangeAudio") as HTMLAudioElement;
        this.selectSound = document.getElementById("menuSelectAudio") as HTMLAudioElement;
        this.defaultBtn = defaultBtn;
        this.setActive(this.defaultBtn);
    }

    public update(input: InputHandler): void {
        this.changeActiveBtn(input);
        if (input.keyPressedOnce("select")) {
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
        const upPressed = input.keyPressedOnce("up");
        const downPressed = input.keyPressedOnce("down");
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