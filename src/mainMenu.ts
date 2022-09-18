import InputHandler from "./input.js";
import MenuList from "./utils/menuList.js";

export default class MainMenu {

    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;

    constructor(onStartNewGame: () => unknown) {
        this.menu = document.getElementById("mainMenu") as HTMLElement;

        const startBtn = document.getElementById("mainMenu_start") as HTMLButtonElement;
        const controlsBtn = document.getElementById("mainMenu_controls") as HTMLButtonElement;
        const highscoresBtn = document.getElementById("mainMenu_highscores") as HTMLButtonElement;
        const exitBtn = document.getElementById("mainMenu_exit") as HTMLButtonElement;
        const menuButtons = [startBtn, controlsBtn, highscoresBtn, exitBtn];

        this.menuList = new MenuList(menuButtons);
        this.menuList.setActive(startBtn);

        startBtn.addEventListener("click", onStartNewGame);
        exitBtn.addEventListener("click", () => window.close());
    }

    public show(): void {
        this.menu.style.display = "block";
    }

    public hide(): void {
        this.menu.style.display = "none";
    }

    public update(input: InputHandler): void {
        this.menuList.update(input);
    }
}