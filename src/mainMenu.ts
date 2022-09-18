import InputHandler from "./input.js";
import MenuList from "./menu/menuList.js";

type MainMenuEvents = {
    onStartNewGame: () => unknown;
}

export default class MainMenu {

    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;
    private readonly controls: InnerMenu;
    private readonly highscores: InnerMenu;
    public shown = false;

    constructor(events: MainMenuEvents) {
        this.menu = document.getElementById("mainMenu")!;
        this.controls = new InnerMenu(this, "controlsMenu");
        this.highscores = new InnerMenu(this, "highscoresMenu");
        const startBtn = document.getElementById("mainMenu_start") as HTMLButtonElement;
        const controlsBtn = document.getElementById("mainMenu_controls") as HTMLButtonElement;
        const highscoresBtn = document.getElementById("mainMenu_highscores") as HTMLButtonElement;
        const exitBtn = document.getElementById("mainMenu_exit") as HTMLButtonElement;
        const menuButtons = [startBtn, controlsBtn, highscoresBtn, exitBtn];

        this.menuList = new MenuList(menuButtons, startBtn);

        startBtn.addEventListener("click", events.onStartNewGame);
        controlsBtn.addEventListener("click", () => this.controls.show());
        highscoresBtn.addEventListener("click", () => this.highscores.show());
        exitBtn.addEventListener("click", () => window.close());
    }

    public show(): void {
        this.menu.style.display = "block";
        this.shown = true;
    }

    public hide(): void {
        this.menu.style.display = "none";
        this.shown = false;
    }

    public update(input: InputHandler): void {
        this.shown && this.menuList.update(input);
        this.controls.shown && this.controls.update(input);
        this.highscores.shown && this.highscores.update(input);
    }
}

class InnerMenu {

    private element: HTMLElement;
    private readonly parent: MainMenu;
    public shown = false;

    constructor(parent: MainMenu, id: string) {
        this.parent = parent;
        this.element = document.getElementById(id)!;
    }

    public show(): void {
        this.parent.hide();
        this.element.style.display = "block";
        this.shown = true;
    }

    public hide(): void {
        this.parent.show();
        this.element.style.display = "none";
        this.shown = false;
    }

    public update(input: InputHandler): void {
        if (input.keyPressed("back")) {
            this.hide();
        }
    }
}