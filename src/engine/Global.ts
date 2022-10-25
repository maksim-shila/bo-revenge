interface GlobalConfig {
    physicsUpdateMs: number;
    debug: boolean;
    window: GameWindow;
    cheats: {
        [key: string]: unknown;
    };
}

export interface GameWindow {
    width: number;
    height: number;
}

export const Global: GlobalConfig = {
    physicsUpdateMs: 16, // 60 fps
    debug: true,
    window: {
        width: 600,
        height: 800,
    },
    cheats: {
        immortal: false,
        unlimitedEnergy: false,
        preventEnemiesSpawn: false,
    },
};
