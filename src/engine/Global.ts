interface GlobalConfig {
    debug: boolean,
    window: GameWindow,
    cheats: {
        [key: string]: unknown
    }
}

export interface GameWindow {
    width: number,
    height: number
}

export const Global: GlobalConfig = {
    debug: true,
    window: {
        width: 600,
        height: 800
    },
    cheats: {}
};