import InputHandler from "../input.js";
import MenuList from "../utils/menuList.js";
import Game from "./game.js";

export default class GameMenu {

    private readonly game: Game;
    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;
    private shown = false;

    private pauseLock = false;

    constructor(game: Game) {
        this.game = game;
        this.menu = document.getElementById("gameMenu") as HTMLElement;

        const continueBtn = document.getElementById("gameMenu_continue") as HTMLButtonElement;
        const restartBtn = document.getElementById("gameMenu_restart") as HTMLButtonElement;
        const exitBtn = document.getElementById("gameMenu_exit") as HTMLButtonElement;
        const menuButtons = [continueBtn, restartBtn, exitBtn];
        this.menuList = new MenuList(menuButtons);
        this.menuList.setActive(continueBtn);

        continueBtn.addEventListener("click", () => this.hide());
    }

    public update(input: InputHandler): void {
        if (input.keyPressed("pause") && !this.pauseLock) {
            this.pauseLock = true;
            this.shown ? this.hide() : this.show();
        } else if (input.keyReleased("pause")) {
            this.pauseLock = false;
        }
        if (this.shown) {
            this.menuList.update(input);
        }
    }

    public show(): void {
        if (!this.shown) {
            this.shown = true;
            this.game.pause();
            this.menu.style.display = "block";
        }
    }

    public hide(): void {
        if (this.shown) {
            this.shown = false;
            this.game.pause();
            this.menu.style.display = "none";
        }
    }
}