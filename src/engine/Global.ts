interface GlobalConfig {
    debug: boolean,
    window: {
        width: number,
        height: number
    }
    cheats: {
        [key: string]: unknown
    }
}

export const Global: GlobalConfig = {
    debug: true,
    window: {
        width: 600,
        height: 800
    },
    cheats: {}
};