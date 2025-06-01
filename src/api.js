// Define variables
const MAIMAI_HOST = "https://maimaidx-eng.com";

const MAIMAI_RECORD_URL = MAIMAI_HOST + "/maimai-mobile/record/";

const MAIMAI_BEST_RECORD_URL = MAIMAI_HOST + "/maimai-mobile/home/ratingTargetMusic/";

/** @enum {number} */
const Performai = {
    maimai: 0,
    chunithm: 1,
    ongeki: 2
};

/**
 * 難度枚舉 - 定義 maimai DX 的五種難度等級
 * @enum {number}
 */
const Difficulty = {
    basic: 0,      // Basic
    advanced: 1,   // Advanced
    expert: 2,     // Expert
    master: 3,     // Master
    remaster: 4,   // Re:Master
};

/** @enum {number} */
const MusicCategory = {
    DEFAULT: 0,
    POPS: 1,       // POPS & ANIME
    Nico: 2,       // Niconico & VOCALOID
    Touhou: 3,     // Touhou Project
    Variety: 4,    // Game & Variety
    Maimai: 5,     // maimai（自家曲目）
    Geki_Chu: 6,   // Chunithm & Ongeki（其餘兩款街機曲目）
};

/**
 * 通關類型枚舉 - 定義歌曲的通關狀態
 * @enum {number}
 */
const ClearType = {
    not_clear: 0,  // 未通關 - 歌曲未完成或失敗
    clear: 1,      // 已通關 - 歌曲成功完成
};

/** @enum {number} */
const MusicKind = {
    dx: 0,         // DX 譜面 - 新版本的觸控譜面
    std: 1,        // Standard 譜面 - 傳統的按鍵譜面
};

/**
 * 成績等級枚舉 - 定義遊戲中的分數等級
 * 從最低的 D 到最高的 SSS+，共 14 個等級
 * @enum {number}
 */
const ScoreRank = {
    d: 0,      // D 等級 - 最低分數等級
    c: 1,      // C 等級
    b: 2,      // B 等級
    bb: 3,     // BB 等級
    bbb: 4,    // BBB 等級
    a: 5,      // A 等級
    aa: 6,     // AA 等級
    aaa: 7,    // AAA 等級
    s: 8,      // S 等級
    sp: 9,     // S+ 等級
    ss: 10,     // SS 等級
    ssp: 11,   // SS+ 等級 - 最高分數等級
    sss: 12,   // SSS 等級
    sssp: 13,  // SSS+ 等級 - 最高分數等級
};

/** @enum {number} */
const FcType = {
    none: 0,
    fc: 1,
    fcp: 2,
    ap: 3,
    app: 4,
};

/** @enum {number} */
const SyncPlayType = {
    none: 0,   // 無同步 - 沒有達成同步要求
    sync: 1,   // SYNC - 基本同步
    fs: 2,     // FS - Full Sync，全同步
    fsp: 3,    // FS+ - Full Sync Plus，全同步且品質較高
    fdx: 4,    // FDX - Full Sync DX，DX 版本的全同步
    fdxp: 5,   // FDX+ - Full Sync DX Plus，DX 版本的最高同步等級
};

class BasicRecord {
    constructor(difficulty, trackNumber, playTime, clearType, displayName) {
        this.difficulty = difficulty;
        this.trackNumber = trackNumber;
        this.playTime = playTime;
        this.clearType = clearType;
        this.displayName = displayName;
    }

    constructor(displayName, difficulty, level, achievementPercent) {
        this.displayName = displayName;
        this.difficulty = difficulty;
        this.level = level;
        this.achievementPercent = achievementPercent;
    }
}

async function mai2_RecentRecords() {
    
}

async function mai2_BestRecords() {
    console.log("mai2 owo");
}

function mai2_CalculateRating(level = 10.0, achievementPercent = 97.0) {
    let factor, rating = 0;

    const factorList = [
        [0, 0],
        [10, 1.6],
        [20, 3.2],
        [30, 4.8],
        [40, 6.4],
        [50, 8.0],
        [60, 9.6],
        [70, 11.2],
        [75, 12.0],
        [80, 13.6],
        [90, 15.2],
        [94, 16.8],
        [97, 20.0],
        [98, 20.3],
        [99, 20.8],
        [99.5, 21.1],
        [100.0, 21.6],
        [100.5, 22.4],
    ];

    if (achievementPercent >= 100.5) factor = 22.4;
    else {
        for (let i = 1; i < factorList.length; i++) {
            if (achievementPercent < factorList[i][0]) {
                factor = factorList[i - 1][1];
                break;
            }
        }
    }

    rating = Math.floor(level * (achievementPercent / 100) * factor);

    return rating;
}

async function chu3_RecentRecords() { }

async function chu3_BestScores() { }

function chu3_CalculateRating(level = 10.0, score = 975000) { }