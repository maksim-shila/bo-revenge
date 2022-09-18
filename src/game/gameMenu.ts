import InputHandler from "../input.js";
import MenuList from "../utils/menuList.js";

type GameMenuEvents = {
    onContinue: () => unknown,
    onRestart: () => unknown,
    onExit: () => unknown
}
export default class GameMenu {

    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;
    private shown = false;

    constructor(events: GameMenuEvents) {
        this.menu = document.getElementById("gameMenu") as HTMLElement;

        const continueBtn = document.getElementById("gameMenu_continue") as HTMLButtonElement;
        const restartBtn = document.getElementById("gameMenu_restart") as HTMLButtonElement;
        const exitBtn = document.getElementById("gameMenu_exit") as HTMLButtonElement;
        const menuButtons = [continueBtn, restartBtn, exitBtn];
        this.menuList = new MenuList(menuButtons, continueBtn);

        continueBtn.addEventListener("click", events.onContinue);
        restartBtn.addEventListener("click", events.onRestart);
        exitBtn.addEventListener("click", events.onExit);
    }

    public update(input: InputHandler): void {
        this.menuList.update(input);
    }

    public show(): void {
        if (!this.shown) {
            this.shown = true;
            this.menu.style.display = "block";
        }
    }

    public hide(): void {
        if (this.shown) {
            this.shown = false;
            this.menu.style.display = "none";
        }
    }
}