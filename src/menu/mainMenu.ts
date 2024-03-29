import * as Bad from "bad-engine";
import Game from "../game/game";
import { Actions } from "../input/Controls";
import MenuList from "./menuList";

export default class MainMenu {

    private readonly menu: HTMLElement;
    private readonly menuList: MenuList;
    private readonly controls: InnerMenu;
    private readonly highscores: InnerMenu;
    private readonly soundtrack: HTMLAudioElement;
    public shown = false;

    constructor(game: Game) {
        this.menu = document.getElementById("mainMenu")!;
        this.soundtrack = document.getElementById("mainMenuAudio") as HTMLAudioElement;
        this.soundtrack.addEventListener("ended", () => this.playSoundtrack());
        this.controls = new InnerMenu(this, "controlsMenu");
        this.highscores = new InnerMenu(this, "highscoresMenu");
        const startBtn = document.getElementById("mainMenu_start") as HTMLButtonElement;
        const controlsBtn = document.getElementById("mainMenu_controls") as HTMLButtonElement;
        const highscoresBtn = document.getElementById("mainMenu_highscores") as HTMLButtonElement;
        const exitBtn = document.getElementById("mainMenu_exit") as HTMLButtonElement;
        const menuButtons = [startBtn, controlsBtn, highscoresBtn, exitBtn];

        this.menuList = new MenuList(menuButtons, startBtn);

        game.onStop = () => this.show();
        startBtn.addEventListener("click", () => {
            game.start();
            this.hide();
        });
        controlsBtn.addEventListener("click", () => this.controls.show());
        highscoresBtn.addEventListener("click", () => this.highscores.show());
        exitBtn.addEventListener("click", () => window.close());
    }

    public show(): void {
        if (this.shown) {
            return;
        }
        if (this.soundtrack.paused) {
            this.playSoundtrack();
        }
        this.menu.style.display = "block";
        this.shown = true;
    }

    public hide(stopSoundtrack = true): void {
        if (stopSoundtrack) {
            this.soundtrack.pause();
        }
        this.menu.style.display = "none";
        this.shown = false;
    }

    public update(input: () => Bad.Input): void {
        this.shown && this.menuList.update(input);
        this.controls.shown && this.controls.update(input);
        this.highscores.shown && this.highscores.update(input);
    }

    private playSoundtrack(): void {
        this.soundtrack.currentTime = 1.8;
        this.soundtrack.play();
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
        this.parent.hide(false);
        this.element.style.display = "block";
        this.shown = true;
    }

    public hide(): void {
        this.parent.show();
        this.element.style.display = "none";
        this.shown = false;
    }

    public update(input: () => Bad.Input): void {
        if (input().keyDown(Actions.Back)) {
            this.hide();
        }
    }
}