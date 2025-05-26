// 新版 API 入口
// =====================================
// 提供外部呼叫的高階函式，實際邏輯委派給各自 fetcher 模組
// =====================================

import { getBestScores } from "./bestScoreFetcher.js";
import { getRecentRecords } from "./recentRecordFetcher.js";

export {
  /**
   * 取得所有難度的最佳成績清單
   * @see bestScoreFetcher.js
   */
  getBestScores,

  /**
   * 取得最近遊玩紀錄
   * @see recentRecordFetcher.js
   */
  getRecentRecords,
};

/**
 * 難度枚舉 - 定義 maimai DX 的五種難度等級
 * @enum {number}
 */
const Difficulty = {
    basic: 0,      // 綠譜 - 基礎難度
    advanced: 1,   // 黃譜 - 進階難度
    expert: 2,     // 紅譜 - 專家難度
    master: 3,     // 紫譜 - 大師難度
    remaster: 4,   // 白譜 - 重製大師難度

    all: 99,       // 全部難度 - 用於搜尋時選擇所有難度
};
/**
 * 通關類型枚舉 - 定義歌曲的通關狀態
 * @enum {number}
 */
const ClearType = {
    not_clear: 0,  // 未通關 - 歌曲未完成或失敗
    clear: 1,      // 已通關 - 歌曲成功完成
};
/**
 * 歌曲類型枚舉 - 定義 maimai DX 的兩種譜面類型
 * @enum {number}
 */
const MusicKind = {
    dx: 0,         // DX 譜面 - 新版本的觸控譜面
    std: 1,   // Standard 譜面 - 傳統的按鍵譜面
};
/**
 * 成績等級枚舉 - 定義遊戲中的分數等級
 * 從最低的 D 到最高的 SSS+，共 13 個等級
 * @enum {number}
 */
const ScoreRank = {
    d: 0,      // D 等級 - 最低分數等級
    c: 1,      // C 等級
    b: 2,      // B 等級
    bb: 3,     // BB 等級
    a: 4,      // A 等級
    aa: 5,     // AA 等級
    aaa: 6,    // AAA 等級
    s: 7,      // S 等級
    sp: 8,     // S+ 等級
    ss: 9,     // SS 等級
    ssp: 10,   // SS+ 等級 - 最高分數等級
    sss: 11,   // SSS 等級
    sssp: 12,  // SSS+ 等級 - 最高分數等級
};
/**
 * FC 類型枚舉 - 定義 Full Combo 的不同等級
 * @enum {number}
 */
const FcType = {
    none: 0,   // 無 FC - 沒有達成 Full Combo
    fc: 1,     // FC - Full Combo，無 Miss
    fcp: 2,    // FC+ - Full Combo Plus，無 Miss 且 Good 數量較少
    ap: 3,     // AP - All Perfect，全 Perfect
    app: 4,    // AP+ - All Perfect Plus，全 Perfect 且包含 Critical Perfect
};
/**
 * 同步類型枚舉 - 定義觸控同步的不同等級
 * @enum {number}
 */
const SyncPlayType = {
    none: 0,   // 無同步 - 沒有達成同步要求
    sync: 1,   // SYNC - 基本同步
    fs: 2,     // FS - Full Sync，全同步
    fsp: 3,    // FS+ - Full Sync Plus，全同步且品質較高
    fsd: 4,    // FSD - Full Sync DX，DX 版本的全同步
    fsdp: 5,   // FSD+ - Full Sync DX Plus，DX 版本的最高同步等級
};

// maimai DX 官方網站的基礎 URL
const MAIMAI_HOST = "https://maimaidx-eng.com";

// 記錄頁面的基礎 URL
const MAIMAI_RECORD_URL = MAIMAI_HOST + "/maimai-mobile/record/";

// 遊戲詳細記錄頁面的 URL 模板，需要加上 playlog ID
const MAIMAI_PLAY_DETAIL_BASE = MAIMAI_RECORD_URL + "playlogDetail/?idx=";

// 最佳成績搜尋頁面的 URL 模板，需要加上難度參數
const MAIMAI_RECORD_BEST_BASE = MAIMAI_RECORD_URL + "musicMybest/search/?diff=";

// 歌曲詳細資訊頁面的 URL 模板，需要加上歌曲 ID
const MAIMAI_RECORD_MUSIC_DETAIL_BASE = MAIMAI_RECORD_URL + "musicDetail/?idx=";

// 歌曲排序搜尋頁面的 URL 模板，包含預設的搜尋參數
// search=A: 搜尋 A 開頭的歌曲, sort=1: 按分數排序, playCheck=on: 只顯示已遊玩的歌曲
const MAIMAI_RECORD_MUSIC_SORT_BASE = MAIMAI_RECORD_URL + "musicSort/search/?search=A&sort=1&playCheck=on&diff=";

/**
 * 基本記錄類別 - 儲存單次遊戲記錄的所有資訊
 * 包含難度、分數、FC 狀態、同步狀態等完整資料
 */
class BasicRecord {
    /** @type {Difficulty} 難度等級 */
    difficulty;
    /** @type {number} 曲目編號（在該次遊戲中的順序） */
    trackNumber;
    /** @type {Date} 遊玩時間 */
    playTime;
    /** @type {ClearType} 通關狀態 */
    clearType;
    /** @type {string} 歌曲顯示名稱 */
    displayName;
    /** @type {string} 歌曲唯一識別碼 */
    musicId;
    /** @type {MusicKind} 歌曲類型（DX 或 Standard） */
    musicKind;
    /** @type {ScoreRank} 成績等級 */
    scoreRank;
    /** @type {number} 達成率百分比，例如 101.4514 代表 101.4514% */
    achievementPercent;
    /** @type {boolean} 是否為達成率新記錄 */
    isAchievementNewRecord;
    /** @type {FcType} FC 類型 */
    fcType;
    /** @type {SyncPlayType} 同步類型 */
    syncPlayType;
    /** @type {number} 同步排名 */
    syncPlayRank;
    /** @type {boolean} 是否為 DX 分數新記錄 */
    isDeluxscoreNewRecord;
    /** @type {number} DX 分數上限 */
    deluxscoreMax;
    /** @type {number} 實際獲得的 DX 分數 */
    deluxscore;
    /** @type {string} 詳細記錄的 ID，用於查詢更多資訊 */
    detailId;

    /**
     * 建構函數 - 建立一個新的基本記錄物件
     * @param {Difficulty} difficulty 難度等級
     * @param {MusicCategory} musicCategory 歌曲分類
     * @param {number} trackNumber 曲目編號
     * @param {Date} playTime 遊玩時間
     * @param {ClearType} clearType 通關狀態
     * @param {string} displayName 歌曲顯示名稱
     * @param {string} musicId 歌曲 ID
     * @param {MusicKind} musicKind 歌曲類型
     * @param {ScoreRank} scoreRank 成績等級
     * @param {number} achievementPercent 達成率百分比，例如 101.4514
     * @param {boolean} isAchievementNewRecord 是否為達成率新記錄
     * @param {FcType} fcType FC 類型
     * @param {SyncPlayType} syncPlayType 同步類型
     * @param {number} syncPlayRank 同步排名
     * @param {boolean} isDeluxscoreNewRecord 是否為 DX 分數新記錄
     * @param {number} deluxscoreMax DX 分數上限
     * @param {number} deluxscore 實際 DX 分數
     * @param {string} detailId 詳細記錄 ID
     */
    constructor(difficulty, musicCategory, trackNumber, playTime, clearType, displayName, musicId, musicKind, scoreRank, achievementPercent, isAchievementNewRecord, fcType, syncPlayType, syncPlayRank, isDeluxscoreNewRecord, deluxscoreMax, deluxscore, detailId,) {
        // 將所有參數賦值給對應的屬性
        this.difficulty = difficulty;
        this.musicCategory = musicCategory;
        this.trackNumber = trackNumber;
        this.playTime = playTime;
        this.clearType = clearType;
        this.displayName = displayName;
        this.musicId = musicId;
        this.musicKind = musicKind;
        this.scoreRank = scoreRank;
        this.achievementPercent = achievementPercent;
        this.isAchievementNewRecord = isAchievementNewRecord;
        this.fcType = fcType;
        this.syncPlayType = syncPlayType;
        this.syncPlayRank = syncPlayRank;
        this.isDeluxscoreNewRecord = isDeluxscoreNewRecord;
        this.deluxscoreMax = deluxscoreMax;
        this.deluxscore = deluxscore;
        this.detailId = detailId;
    }
}
/**
 * 詳細記錄類別 - 儲存單首歌曲在所有難度的完整記錄資訊
 * 包含歌曲基本資訊和各難度的詳細成績
 */
class DetailedRecord {
    /** @type {string} 歌曲唯一識別碼 */
    musicId;
    /** @type {string} 歌曲顯示名稱 */
    songDisplayName;
    /** @type {string} 歌曲藝術家/作者 */
    songArtist;

    /** @type {Map<Difficulty, DetailedRecordInner>} 各難度的詳細記錄，以難度為鍵值 */
    subRecords;

    /**
     * 建構函數 - 建立一個新的詳細記錄物件
     * @param {string} musicId 歌曲 ID
     * @param {string} songDisplayName 歌曲顯示名稱
     * @param {string} songArtist 歌曲藝術家
     * @param {Map<Difficulty, DetailedRecordInner>} subRecords 各難度的詳細記錄
     */
    constructor(musicId, songDisplayName, songArtist, subRecords) {
        // 將所有參數賦值給對應的屬性
        this.musicId = musicId;
        this.songDisplayName = songDisplayName;
        this.songArtist = songArtist;
        this.subRecords = subRecords;
    }
}
/**
 * 詳細記錄內部類別 - 儲存單一難度的完整成績資訊
 * 包含該難度的所有統計資料和歷史記錄
 */
class DetailedRecordInner {
    /** @type {Difficulty} 難度等級 */
    difficulty;
    /** @type {MusicCategory} 歌曲分類 */
    musicCategory;
    /** @type {MusicKind} 歌曲類型（DX 或 Standard） */
    musicKind;
    /** @type {number} 歌曲等級顯示（如 13+, 14 等） */
    songDisplayLevel;
    /** @type {ScoreRank} 最佳成績等級 */
    scoreRank;
    /** @type {FcType} 最佳 FC 類型 */
    fcType;
    /** @type {SyncPlayType} 最佳同步類型 */
    syncPlayType;
    /** @type {Date} 最後遊玩日期 */
    lastPlayDate;
    /** @type {number} 總遊玩次數 */
    playCount;
    /** @type {number} 最佳達成率百分比，例如 101.4514 */
    achievementPercent;
    /** @type {number} 最佳 DX 分數 */
    deluxscore;
    /** @type {number} DX 分數上限 */
    deluxscoreMax;

    /**
     * 建構函數 - 建立一個新的詳細記錄內部物件
     * @param {Difficulty} difficulty 難度等級
     * @param {MusicCategory} musicCategory 歌曲分類
     * @param {MusicKind} musicKind 歌曲類型
     * @param {number} songDisplayLevel 歌曲等級
     * @param {ScoreRank} scoreRank 成績等級
     * @param {FcType} fcType FC 類型
     * @param {SyncPlayType} syncPlayType 同步類型
     * @param {Date} lastPlayDate 最後遊玩日期
     * @param {number} playCount 遊玩次數
     * @param {number} achievementPercent 達成率百分比
     * @param {number} deluxscore DX 分數
     * @param {number} deluxscoreMax DX 分數上限
     */
    constructor(difficulty, musicCategory, musicKind, songDisplayLevel, scoreRank, fcType, syncPlayType, lastPlayDate, playCount, achievementPercent, deluxscore, deluxscoreMax) {
        // 將所有參數賦值給對應的屬性
        this.difficulty = difficulty;
        this.musicCategory = musicCategory;
        this.musicKind = musicKind;
        this.songDisplayLevel = songDisplayLevel;
        this.scoreRank = scoreRank;
        this.fcType = fcType;
        this.syncPlayType = syncPlayType;
        this.lastPlayDate = lastPlayDate;
        this.playCount = playCount;
        this.achievementPercent = achievementPercent;
        this.deluxscore = deluxscore;
        this.deluxscoreMax = deluxscoreMax;
    }
}

/**
 * 檢查是否能夠執行 API 函數
 * 驗證當前頁面是否在 maimai DX 官方網站上
 * @returns {boolean} 如果可以執行返回 true，否則返回 false
 */
function ensureAbleToExecute() {
    // 檢查當前頁面 URL 是否包含 maimai 官方網站域名
    if (document.URL.includes(MAIMAI_HOST) === false) {
        // 如果不在官方網站上，輸出警告訊息
        console.warn("not on maimai site, url: " + document.URL);
        return false;
    }
    return true;
}

/**
 * 檢查是否能夠執行 API 函數，如果不能則拋出錯誤
 * 這是 ensureAbleToExecute 的嚴格版本
 * @returns {void}
 * @throws {Error} 如果不在 maimai 網站上則拋出錯誤
 */
function ensureAbleToExecuteOrThrow() {
    // 如果環境檢查失敗，直接拋出錯誤
    if (ensureAbleToExecute() === false) {
        throw new Error("not on maimai site, url: " + document.URL);
    }
}

/**
 * 將 HTTP 回應轉換為文字格式
 * @param {Response} response HTTP 回應物件
 * @returns {Promise<string>} 回應的文字內容
 * @throws {Error} 如果回應狀態不正常則拋出錯誤
 */
async function getResponseAsText(response) {
    // 檢查 HTTP 回應是否成功
    if (response.ok) {
        // 如果成功，將回應內容轉換為文字
        return await response.text();
    } else {
        // 如果失敗，拋出包含狀態碼的錯誤
        throw new Error("response error, status: " + response.status);
    }
}

/**
 * 將 HTTP 回應轉換為 DOM 文件物件
 * @param {Response} response HTTP 回應物件
 * @param {string} type MIME 類型，預設為 "text/html"
 * @returns {Promise<Document>} 解析後的 DOM 文件
 * @throws {Error} 如果回應狀態不正常則拋出錯誤
 */
async function getResponseAsDOM(response, type = "text/html") {
    // 先將回應轉換為文字
    const text = await getResponseAsText(response);
    // 使用 DOMParser 將 HTML 文字解析為 DOM 物件
    const doc = new DOMParser().parseFromString(text, type);
    return doc;
}

/**
 * 清理 DOM 文件，移除不必要的節點並簡化結構
 * 這個函數會移除 head、header、footer 等不需要的元素
 * @param {Document} dom 要清理的 DOM 文件
 */
async function removeBasicDOMShit(dom) {
    // 移除 head 標籤，因為我們只需要內容
    dom.head.remove();
    
    // 尋找主要內容容器並將其設為根節點
    for (const node of new Array(...dom.body.children)) {
        if (node.classList.contains("main_wrapper")) {
            // 移除原本的 documentElement
            dom.documentElement.remove();
            // 將主要內容設為新的根節點
            dom.appendChild(node);
        }
    }
    
    // 移除不需要的頁面元素
    dom.documentElement.querySelector("header")?.remove();  // 移除頁首
    dom.documentElement.querySelector("footer")?.remove();  // 移除頁尾
    
    // 以下是可選的清理項目（目前被註解掉）
    // dom.documentElement.querySelector(".title.m_10")?.remove();
    // dom.documentElement.querySelector(".m_t_5.m_b_10.t_l.f_0")?.remove();
    // dom.documentElement.querySelector(".m_15")?.remove();
    // dom.documentElement.querySelector(".f_0")?.remove();
}

/**
 * 從圖片 URL 解析難度等級
 * @param {string} url 難度圖片的 URL
 * @returns {Difficulty} 解析出的難度等級
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseDifficultyFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/diff_advanced.png
    // 使用正則表達式匹配 "diff_" 後面的難度名稱
    const match = url.match(/diff_(\w+)\.png/);
    if (match) {
        // 將難度名稱轉換為小寫，以符合枚舉格式
        const difficulty = match[1].toLowerCase();
        // 檢查是否為有效的難度枚舉值
        if (difficulty in Difficulty) {
            return Difficulty[difficulty];
        }
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid difficulty url: " + url);
}

/**
 * 從文字中解析曲目編號
 * @param {string} text 包含曲目編號的文字
 * @returns {number} 解析出的曲目編號
 * @throws {Error} 如果文字格式無效則拋出錯誤
 */
function parseTrackNumberFromText(text) {
    // 範例文字: "TRACK 04"
    // 使用正則表達式匹配 "TRACK " 後面的數字
    const match = text.match(/TRACK (\d+)/);
    if (match) {
        // 將匹配到的數字字串轉換為整數
        return parseInt(match[1]);
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid track number text: " + text);
}

/**
 * 從文字中解析 DX 分數資訊
 * @param {string} text 包含 DX 分數的文字，格式如 "2,485 / 2,500"
 * @returns {[number, number]} 陣列，索引 0 是實際分數，索引 1 是最高分數
 */
function parseDeluxscoreFromText(text) {
    // 移除所有逗號分隔符，然後以 "/" 分割字串
    const texts = text.replaceAll(",", "").split("/");
    // 返回 [實際分數, 最高分數] 的陣列
    return [parseInt(texts[0]), parseInt(texts[1])];
}

/**
 * 從圖片 URL 解析通關類型
 * @param {string?} url 通關類型圖片的 URL，可能為 null 或 undefined
 * @returns {ClearType} 解析出的通關類型
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseClearTypeFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/clear.png
    // 如果 URL 為空，表示未通關
    if (url === null || url === undefined || url === "") {
        return ClearType.not_clear;
    }

    // 使用正則表達式匹配 "playlog/" 後面的通關類型名稱
    const match = url.match(/playlog\/(\w+)\.png/);
    if (match) {
        // 將通關類型名稱轉換為小寫，以符合枚舉格式
        const clearType = match[1].toLowerCase();
        // 檢查是否為有效的通關類型枚舉值
        if (clearType in ClearType) {
            return ClearType[clearType];
        }
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid clear type url: " + url);
}

/**
 * 從圖片 URL 解析歌曲 ID
 * @param {string} url 歌曲封面圖片的 URL
 * @returns {string} 純粹的歌曲 ID，如 "a5c6705e2bfa3419"
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseMusicIdFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/Music/a5c6705e2bfa3419.png
    // 使用正則表達式匹配 "Music/" 後面的歌曲 ID
    const match = url.match(/Music\/([a-zA-Z0-9]+)\.png/);
    if (match) {
        // 返回匹配到的歌曲 ID
        return match[1];
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid music id url: " + url);
}

/**
 * 從圖片 URL 解析歌曲類型（DX 或 Standard）
 * @param {string} url 歌曲類型圖片的 URL
 * @returns {MusicKind} 解析出的歌曲類型
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseMusicKindFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/music_dx.png
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/music_standard.png
    
    // 直接檢查 URL 是否包含特定的檔案名稱
    if (url.includes('music_dx.png')) {
        return MusicKind.dx;
    } else if (url.includes('music_standard.png')) {
        return MusicKind.std;
    }
    
    // 如果直接匹配失敗，嘗試使用正則表達式解析
    const match = url.match(/music_(\w+)\.png/);
    if (match) {
        const musicKind = match[1].toLowerCase();
        if (musicKind === 'dx') {
            return MusicKind.dx;
        } else if (musicKind === 'standard') {
            return MusicKind.std;
        }
    }
    
    // 如果都無法解析，輸出警告並返回預設值
    console.warn("Unable to parse music kind, using default DX:", url);
    return MusicKind.dx;
}

/**
 * 從圖片 URL 解析成績等級
 * 支援多種 URL 格式，包括 playlog 和 music_icon 兩種類型
 * @param {string} url 成績等級圖片的 URL
 * @returns {ScoreRank} 解析出的成績等級
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseScoreRankFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/splus.png
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/ssplus.png
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/sssplus.png
    
    // 首先移除 URL 參數（如 ?ver=1.50）
    const cleanUrl = url.split('?')[0];
    
    // 提取檔案名稱（不含副檔名）
    const match = cleanUrl.match(/\/([^\/]+)\.png$/);
    if (match) {
        let iconName = match[1].toLowerCase();
        
        // 處理背景圖片或虛擬圖標（沒有成績等級）
        if (iconName.includes('back') || iconName.includes('dummy')) {
            return ScoreRank.d; // 背景圖標使用預設的最低等級
        }
        
        // 處理特殊格式
        if (iconName === 'splus') return ScoreRank.sp;     // S+ 的另一種格式
        if (iconName === 'ssplus') return ScoreRank.ssp;   // SS+ 的另一種格式
        if (iconName === 'sssplus') return ScoreRank.sssp; // SSS+ 的另一種格式
        
        // 轉換為小寫以符合枚舉鍵值格式（我們的枚舉鍵值都是小寫）
        const scoreRankKey = iconName.toLowerCase();
        if (scoreRankKey in ScoreRank) {
            return ScoreRank[scoreRankKey];
        }
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid song rank url: " + url);
}

/**
 * 從圖片 URL 解析 FC（Full Combo）類型
 * 支援多種 FC 類型，包括 FC、FC+、AP、AP+ 等
 * @param {string} url FC 類型圖片的 URL
 * @returns {FcType} 解析出的 FC 類型
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseFcTypeFromUrl(url) {
    // FC URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/fc.png
    // FC+ URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/fcplus.png
    // AP URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/ap.png
    // AP+ URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/applus.png
    // FC Dummy URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/fc_dummy.png
    
    // 首先移除 URL 參數（如 ?ver=1.50）
    const cleanUrl = url.split('?')[0];
    
    // 提取檔案名稱（不含副檔名）
    const match = cleanUrl.match(/\/([^\/]+)\.png$/);
    if (match) {
        let iconName = match[1].toLowerCase();
        
        // 處理 music_icon_ 前綴，將其移除以取得純粹的 FC 類型名稱
        if (iconName.startsWith('music_icon_')) {
            iconName = iconName.replace('music_icon_', '');
        }
        
        // 處理背景圖片或虛擬圖標（沒有 FC）
        if (iconName.includes('back') || iconName.includes('dummy')) {
            return FcType.none;
        }
        
        // 處理特殊格式
        if (iconName === 'fcplus') return FcType.fcp;  // FC+ 的另一種格式
        
        // 轉換為大寫以符合枚舉格式
        const fcTypeKey = iconName.toUpperCase();
        if (fcTypeKey in FcType) {
            return FcType[fcTypeKey];
        }
        
        // 轉換為小寫以符合枚舉格式（fcp, fc, ap, app）
        const fcTypeKeyLower = iconName.toLowerCase();
        if (fcTypeKeyLower in FcType) {
            return FcType[fcTypeKeyLower];
        }
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid fc type url: " + url);
}

/**
 * 從圖片 URL 解析同步遊玩類型
 * 支援多種同步類型，包括 SYNC、FS、FS+、FSD、FSD+ 等
 * @param {string} url 同步類型圖片的 URL
 * @returns {SyncPlayType} 解析出的同步類型
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseSyncPlayTypeFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/sync.png
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/music_icon_sync.png?ver=1.50
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png?ver=1.50 (FSD+)
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/sync_dummy.png?ver=1.50
    
    // 首先移除 URL 參數（如 ?ver=1.50）
    const cleanUrl = url.split('?')[0];
    
    // 提取檔案名稱（不含副檔名）
    const match = cleanUrl.match(/\/([^\/]+)\.png$/);
    if (match) {
        let iconName = match[1].toLowerCase();
        
        // 處理 music_icon_ 前綴，將其移除以取得純粹的同步類型名稱
        if (iconName.startsWith('music_icon_')) {
            iconName = iconName.replace('music_icon_', '');
        }
        
        // 處理背景圖片或虛擬圖標（沒有同步）
        if (iconName.includes('back') || iconName.includes('dummy')) {
            return SyncPlayType.none;
        }
        
        // 處理特殊的同步類型縮寫
        if (iconName === 'fsdp') return SyncPlayType.fsdp;  // FSD+ 的縮寫
        if (iconName === 'fsp') return SyncPlayType.fsp;    // FS+ 的縮寫
        
        // 轉換為小寫以符合枚舉格式（sync, fs, fsp, fsd, fsdp）
        const syncTypeKeyLower = iconName.toLowerCase();
        if (syncTypeKeyLower in SyncPlayType) {
            return SyncPlayType[syncTypeKeyLower];
        }
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid sync play type url: " + url);
}

/**
 * 從圖片 URL 解析同步遊玩排名
 * 解析玩家在同步遊玩中的排名（1st, 2nd, 3rd 等）
 * @param {string} url 同步排名圖片的 URL
 * @returns {number} 解析出的排名數字
 * @throws {Error} 如果 URL 格式無效則拋出錯誤
 */
function parseSyncPlayRankFromUrl(url) {
    // 範例 URL: https://maimaidx-eng.com/maimai-mobile/img/playlog/2nd.png
    // 如果 URL 為空，返回 0 表示沒有排名
    if (url === null || url === undefined || url === "") {
        return 0;
    }

    // 使用正則表達式匹配 "playlog/" 後面的排名資訊
    const match = url.match(/playlog\/(\w+)\.png/);
    if (match) {
        // 取得排名字串的第一個字元（數字部分）
        const syncPlayRank = match[1].substring(0, 1);
        // 將字串轉換為整數並返回
        return parseInt(syncPlayRank);
    }
    // 如果無法解析，拋出錯誤
    throw new Error("Invalid sync play rank url: " + url);
}

/**
 * 生成遊戲詳細記錄的 URL
 * @param {string} playlogId 遊戲記錄的唯一識別碼
 * @returns {string} 完整的詳細記錄 URL
 */
function getPlayDetailUrl(playlogId) {
    // 將 playlogId 進行 URL 編碼以確保安全性，然後組合成完整 URL
    return MAIMAI_PLAY_DETAIL_BASE + encodeURIComponent(playlogId);
}

/**
 * 生成最佳成績搜尋頁面的 URL
 * @param {Difficulty} difficulty 要搜尋的難度等級
 * @returns {string} 完整的最佳成績搜尋 URL
 */
function getBestRecordSearchUrl(difficulty) {
    // 將難度轉換為字串並組合成搜尋 URL
    return MAIMAI_RECORD_BEST_BASE + difficulty.toString();
}

/**
 * 生成歌曲排序搜尋頁面的 URL
 * @param {Difficulty} difficulty 要搜尋的難度等級
 * @returns {string} 完整的歌曲排序搜尋 URL
 */
function getMusicSortUrl(difficulty) {
    // 將難度轉換為字串並組合成排序搜尋 URL
    return MAIMAI_RECORD_MUSIC_SORT_BASE + difficulty.toString();
}

/**
 * 生成歌曲詳細資訊頁面的 URL
 * @param {string} idx 歌曲的索引或 ID
 * @returns {string} 完整的歌曲詳細資訊 URL
 */
function getMusicDetailUrl(idx) {
    // 將歌曲索引進行 URL 編碼並組合成詳細資訊 URL
    return MAIMAI_RECORD_MUSIC_DETAIL_BASE + encodeURIComponent(idx);
}

/**
 * 將難度枚舉轉換為可讀的文字描述
 * @param {Difficulty} difficulty 難度枚舉值
 * @returns {string} 難度的文字描述
 */
function getDifficultyText(difficulty) {
    // 根據難度枚舉值返回對應的中文描述
    switch (difficulty) {
        case Difficulty.basic: return "Basic";      // 基礎難度
        case Difficulty.advanced: return "Advanced"; // 進階難度
        case Difficulty.expert: return "Expert";    // 專家難度
        case Difficulty.master: return "Master";    // 大師難度
        case Difficulty.remaster: return "Re:Master"; // 重製大師難度
        default: return "Unknown";                   // 未知難度
    }
}

/**
 * 取得指定歌曲的詳細記錄資訊
 * 包含該歌曲在所有難度的完整成績資料
 * @param {string} idx 歌曲的索引或 ID
 * @returns {DetailedRecord} 詳細記錄物件，包含歌曲資訊和各難度成績
 * @throws {Error} 如果不在 maimai 網站上或網路請求失敗
 */
async function getDetailedMusicRecord(idx) {
    // 確保在正確的網站環境中執行
    ensureAbleToExecuteOrThrow();
    
    // 發送請求並取得歌曲詳細頁面的 DOM
    const dom = await getResponseAsDOM(await fetch(getMusicDetailUrl(idx)));
    // 清理 DOM，移除不必要的元素
    removeBasicDOMShit(dom);

    // 解析歌曲基本資訊
    const basicBlock = dom.documentElement.querySelector(".basic_block");
    const innerBlockDivs = basicBlock.querySelector(".w_250")
        .querySelectorAll("div");

    // 從封面圖片 URL 解析歌曲 ID
    const musicId = parseMusicIdFromUrl(basicBlock.firstElementChild.src);
    // 取得歌曲顯示名稱
    const songDisplayName = innerBlockDivs[1].textContent;
    // 取得歌曲藝術家名稱並去除空白
    const songArtist = innerBlockDivs[2].textContent.trim();

    // 移除不是難度相關的元素，只保留五個難度的資料
    for (const element of new Array(...dom.documentElement.children)) {
        if (!["advanced", "master", "basic", "remaster", "expert"].includes(element.id)) element.remove();
    }

    // 建立記錄 Map，以難度為鍵值
    const records = new Map();
    
    // 遍歷每個難度的資料節點
    for (const node of dom.documentElement.children) {
        // 取得成績相關的區塊
        const innerBlock = node.querySelector(".t_r.f_r");
        const innerBlock2 = node.lastElementChild;

        // 取得詳細資訊表格
        const blackBlock = innerBlock
            .querySelector(".black_block")
            .querySelector("table")
            .tBodies[0];

        // 取得所有圖片元素（用於解析成績等級、FC、同步等資訊）
        const imgs = innerBlock.querySelectorAll("img");
        // 解析 DX 分數資訊
        const deluxscoreTexts = parseDeluxscoreFromText(innerBlock2.lastElementChild.lastChild.textContent);

        // 解析各種屬性
        const difficulty = parseDifficultyFromUrl(node.querySelector("img").src);           // 難度
        const musicKind = parseMusicKindFromUrl(node.querySelector(".music_kind_icon").src); // 歌曲類型
        const songDisplayLevel = parseInt(node.querySelector(".music_lv_back").innerText);   // 歌曲等級

        const scoreRank = parseScoreRankFromUrl(imgs[0].src);        // 成績等級
        const fcType = parseFcTypeFromUrl(imgs[1].src);              // FC 類型
        const syncPlayType = parseSyncPlayTypeFromUrl(imgs[2].src);  // 同步類型

        // 解析遊玩資訊
        const lastPlayDate = new Date(blackBlock.rows[0].cells[1].innerText);  // 最後遊玩日期
        const playCount = parseInt(blackBlock.rows[1].cells[1].innerText);     // 遊玩次數

        // 解析分數資訊
        const achievementPercent = parseFloat(innerBlock2.firstElementChild.innerText); // 達成率
        const deluxscore = deluxscoreTexts[0];     // DX 分數
        const deluxscoreMax = deluxscoreTexts[1];  // DX 分數上限

        // 建立詳細記錄內部物件並加入 Map
        records.set(difficulty, new DetailedRecordInner(difficulty, musicKind, songDisplayLevel, scoreRank, fcType, syncPlayType, lastPlayDate, playCount, achievementPercent, deluxscore, deluxscoreMax));
    }

    // 返回完整的詳細記錄物件
    return new DetailedRecord(musicId, songDisplayName, songArtist, records);
}

/**
 * 取得所有難度的前 10 名最高分記錄
 * 這個函數會依序搜尋每個難度，並取得每個難度的前 10 名成績
 * @param {number} cooldown 請求間隔時間（毫秒），預設 400ms，避免過於頻繁的請求
 * @returns {Array<BasicRecord>} 所有難度的前 10 名記錄陣列
 * @throws {Error} 如果不在 maimai 網站上
 */
async function getAllRecordsBySearch(cooldown = 400) {
    // 確保在正確的網站環境中執行
    ensureAbleToExecuteOrThrow();
    
    // 儲存所有記錄的陣列
    const allRecords = [];
    
    // 定義要搜尋的所有難度
    const difficulties = [
        Difficulty.basic,     // 基礎難度
        Difficulty.advanced,  // 進階難度
        Difficulty.expert,    // 專家難度
        Difficulty.master,    // 大師難度
        Difficulty.remaster   // 重製大師難度
    ];
    
    // 依序處理每個難度
    for (let i = 0; i < difficulties.length; i++) {
        const difficulty = difficulties[i];
        
        try {
            // 輸出載入進度訊息
            console.log(`loading ${getDifficultyText(difficulty)} records...`);
            
            // 發送請求並取得該難度的排序頁面 DOM
            const dom = await getResponseAsDOM(await fetch(getMusicSortUrl(difficulty)));
            // 清理 DOM
            removeBasicDOMShit(dom);
            
            // 解析該難度的所有記錄
            const difficultyRecords = parseMusicSortRecords(dom, difficulty);
            
            // 只取前 10 名記錄
            const top10Records = difficultyRecords.slice(0, 10);
            
            // 輸出找到的記錄數量
            console.log(`${getDifficultyText(difficulty)} found ${top10Records.length} records`);
            
            // 將記錄加入總陣列
            allRecords.push(...top10Records);
            
            // 如果不是最後一個難度，等待指定的冷卻時間
            if (i < difficulties.length - 1) {
                await new Promise(resolve => setTimeout(resolve, cooldown));
            }
            
        } catch (error) {
            // 如果某個難度載入失敗，輸出錯誤但繼續處理其他難度
            console.error(`Loading ${getDifficultyText(difficulty)} records failed:`, error);
        }
    }
    
    // 輸出總記錄數量
    console.log(`Loaded total ${allRecords.length} records`);
    return allRecords;
}

/**
 * 從歌曲排序頁面解析記錄資料
 * 解析頁面中的每個歌曲記錄，提取成績、難度、FC 狀態等資訊
 * @param {Document} dom 歌曲排序頁面的 DOM 物件
 * @param {Difficulty} difficulty 當前搜尋的難度等級
 * @returns {Array<BasicRecord>} 解析出的基本記錄陣列
 */
function parseMusicSortRecords(dom, difficulty) {
    // 儲存解析結果的陣列
    const records = [];
    
    // 選取所有歌曲記錄節點（根據不同難度的 CSS 類別）
    const recordNodes = dom.documentElement.querySelectorAll('.music_master_score_back, .music_basic_score_back, .music_advanced_score_back, .music_expert_score_back, .music_remaster_score_back');
    
    // 遍歷每個記錄節點
    for (const node of recordNodes) {
        try {
            // 檢查是否有難度圖片，沒有則跳過
            const diffImg = node.querySelector('img[src*="/diff_"]');
            if (!diffImg) continue;
            
            // 解析歌曲類型（DX 或 Standard）
            const musicKindImg = node.querySelector('.music_kind_icon');
            let musicKind = MusicKind.dx; // 預設為 DX
            if (musicKindImg) {
                try {
                    musicKind = parseMusicKindFromUrl(musicKindImg.src);
                } catch (e) {
                    // 如果解析失敗，輸出警告但繼續使用預設值
                    console.warn('cannot parse music kind:', musicKindImg.src);
                }
            }
            
            // 解析歌曲等級
            const levelBlock = node.querySelector('.music_lv_block');
            let songDisplayLevel = 0;
            if (levelBlock) {
                const levelText = levelBlock.textContent.trim();
                // 將 "+" 轉換為 ".5"（例如 "13+" 變成 "13.5"）
                songDisplayLevel = parseFloat(levelText.replace('+', '.5')) || 0;
            }
            
            // 解析歌曲名稱
            const nameBlock = node.querySelector('.music_name_block');
            const displayName = nameBlock ? nameBlock.textContent.trim() : 'Unknown';
            
            // 解析成績資訊
            const scoreBlocks = node.querySelectorAll('.music_score_block');
            let achievementPercent = 0;
            if (scoreBlocks.length > 0) {
                // 移除百分比符號並解析達成率
                const achievementText = scoreBlocks[0].textContent.replace('%', '').trim();
                achievementPercent = parseFloat(achievementText) || 0;
            }
            
            // 解析 DX 分數
            let deluxscore = 0;
            let deluxscoreMax = 0;
            if (scoreBlocks.length > 1) {
                try {
                    const deluxscoreText = scoreBlocks[1].textContent.trim();
                    // 匹配 "1,234 / 5,678" 格式的 DX 分數
                    const deluxscoreMatch = deluxscoreText.match(/(\d+(?:,\d+)*)\s*\/\s*(\d+(?:,\d+)*)/);
                    if (deluxscoreMatch) {
                        // 移除千位分隔符號並轉換為數字
                        deluxscore = parseInt(deluxscoreMatch[1].replace(/,/g, ''));
                        deluxscoreMax = parseInt(deluxscoreMatch[2].replace(/,/g, ''));
                    }
                } catch (e) {
                    console.warn('Unable to parse DX score:', scoreBlocks[1].textContent);
                }
            }
            
            // 取得所有成績圖標
            const iconImgs = node.querySelectorAll('img[src*="/music_icon_"]');
            
            // 初始化成績相關變數
            let scoreRank = ScoreRank.d;           // 成績等級，預設為 D
            let fcType = FcType.none;              // FC 類型，預設為無
            let syncPlayType = SyncPlayType.none;  // 同步類型，預設為無
            
            // 遍歷所有圖標，解析成績資訊
            for (const img of iconImgs) {
                const src = img.src;
                
                try {
                    // 跳過背景圖片和虛擬圖標
                    if (src.includes('back') || src.includes('dummy') || src.includes('base')) {
                        continue;
                    }
                    
                    // 優先檢查同步類型（更具體的模式）
                    if (src.includes('sync') || src.includes('fsd') || src.includes('fs')) {
                        syncPlayType = parseSyncPlayTypeFromUrl(src);
                    }
                    // 檢查 FC 類型
                    else if (src.includes('fc') || src.includes('ap')) {
                        fcType = parseFcTypeFromUrl(src);
                    }
                    // 檢查成績等級 - 使用更精確的模式匹配
                    else if (src.includes('sss') || src.includes('ss') || 
                             src.match(/music_icon_[abcd]\.png/) || src.match(/music_icon_s\.png/)) {
                        scoreRank = parseScoreRankFromUrl(src);
                    }
                } catch (e) {
                    // 如果解析圖標失敗，輸出警告但繼續處理
                    console.warn('Unable to parse icon:', src, e.message);
                }
            }
            
            // 取得詳細記錄的 ID（用於後續查詢詳細資訊）
            const hiddenInput = node.querySelector('input[name="idx"]');
            const detailId = hiddenInput ? hiddenInput.value : '';
            
            // 建立基本記錄物件
            const record = new BasicRecord(
                difficulty,           // 難度
                0,                   // 曲目編號（在排序頁面中不適用）
                new Date(),          // 遊玩時間（使用當前時間）
                ClearType.clear,     // 通關狀態（假設已通關）
                displayName,         // 歌曲名稱
                '',                  // 歌曲 ID（在此頁面無法取得）
                musicKind,           // 歌曲類型
                scoreRank,           // 成績等級
                achievementPercent,  // 達成率
                newRecord,           // 是否為達成率新記錄
                fcType,              // FC 類型
                syncPlayType,        // 同步類型
                syncPlayRank,        // 同步排名
                isDeluxscoreNewRecord,               // 是否為 DX 分數新記錄
                deluxscoreMax,       // DX 分數上限
                deluxscore,          // DX 分數
                detailId             // 詳細記錄 ID
            );
            
            // 將記錄加入陣列
            records.push(record);
            
        } catch (error) {
            // 如果解析單個記錄失敗，輸出錯誤但繼續處理其他記錄
            console.error('Parse records failed:', error);
        }
    }
    
    // 按達成率降序排序
    records.sort((a, b) => b.achievementPercent - a.achievementPercent);
    
    return records;
}

/**
 * 
 * @returns {Array<BasicRecord>}
 */
async function getBasicRecords() {
    ensureAbleToExecuteOrThrow();
    const dom = await getResponseAsDOM(await fetch(MAIMAI_RECORD_URL));
    removeBasicDOMShit(dom);

    const records = [];
    for (const node of dom.documentElement.children) {
        if (!node.classList.contains("p_10")) continue;

        const topContainer = node.firstElementChild;
        const subtitle = topContainer.querySelector(".sub_title");

        const moreContainer = node.lastElementChild;
        const basicBlock = moreContainer.querySelector(".basic_block");
        const prBlock = moreContainer.children[1];
        const playResult = moreContainer.querySelector(".playlog_result_block");

        const playAchievement = playResult.querySelector(".playlog_achievement_txt");
        const playResultInnerBlock = playResult.querySelector(".playlog_result_innerblock");

        const scoreBlock = playResultInnerBlock.querySelector(".playlog_score_block");

        // datas
        const difficulty = parseDifficultyFromUrl(topContainer.querySelector(".playlog_diff").src);
        const trackNumber = parseTrackNumberFromText(subtitle.firstElementChild.innerText);
        const playTime = new Date(subtitle.lastElementChild.innerText);

        const clearType = parseClearTypeFromUrl(basicBlock.querySelector("img")?.src);
        const displayName = clearType === ClearType.not_clear ? basicBlock.innerText : basicBlock.childNodes[1].textContent;
        const musicId = parseMusicIdFromUrl(prBlock.querySelector(".music_img").src);
        const musicKind = parseMusicKindFromUrl(prBlock.querySelector(".playlog_music_kind_icon").src);

        const scoreRank = parseScoreRankFromUrl(playResult.querySelector(".playlog_scorerank").src);

        const achievementPercent = parseFloat(playAchievement.firstChild.textContent + playAchievement.firstElementChild.innerText);
        const isAchievementNewRecord = playAchievement.querySelector(".playlog_achievement_newrecord") !== null;

        const fcType = parseFcTypeFromUrl(playResultInnerBlock.children[1].src);
        const syncPlayType = parseSyncPlayTypeFromUrl(playResultInnerBlock.children[2].src);
        const syncPlayRank = parseSyncPlayRankFromUrl(playResultInnerBlock.children.length > 4 ? playResultInnerBlock.children[3].src : null);

        const isDeluxscoreNewRecord = scoreBlock.querySelector(".playlog_deluxscore_newrecord") !== null;
        const deluxscoreTexts = parseDeluxscoreFromText(scoreBlock.querySelector("div").innerText);
        const deluxscoreMax = deluxscoreTexts[1];
        const deluxscore = deluxscoreTexts[0];

        const detailId = playResult.querySelector("form").querySelector("input").value;

        records.push(new BasicRecord(difficulty, trackNumber, playTime, clearType, displayName, musicId, musicKind, scoreRank, achievementPercent, isAchievementNewRecord, fcType, syncPlayType, syncPlayRank, isDeluxscoreNewRecord, deluxscoreMax, deluxscore, detailId));
    }

    return records;
}
