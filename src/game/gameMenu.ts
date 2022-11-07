import * as Bad from "bad-engine";
import { Actions } from "../input/Controls";
import MenuList from "../menu/menuList";
import Game from "./game";

export default class GameMenu {

    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;
    private shown = false;
    private continueBtn: HTMLButtonElement;

    constructor(game: Game) {
        this.menu = document.getElementById("gameMenu") as HTMLElement;

        this.continueBtn = document.getElementById("gameMenu_continue") as HTMLButtonElement;
        const restartBtn = document.getElementById("gameMenu_restart") as HTMLButtonElement;
        const exitBtn = document.getElementById("gameMenu_exit") as HTMLButtonElement;
        const menuButtons = [this.continueBtn, restartBtn, exitBtn];
        this.menuList = new MenuList(menuButtons, this.continueBtn);

        this.continueBtn.addEventListener("click", () => {
            game.continue();
            this.hide();
        });
        restartBtn.addEventListener("click", () => {
            game.restart();
            this.hide();
        });
        exitBtn.addEventListener("click", () => {
            game.stop();
            this.hide();
        });
    }

    public update(input: () => Bad.Input): void {
        if (input().keyDownOnce(Actions.Back)) {
            this.continueBtn.click();
        }
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