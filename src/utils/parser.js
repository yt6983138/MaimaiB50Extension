import { ICON_MAP, ScoreRank, FcType, SyncPlayType, ClearType, Difficulty } from "../constants.js";

/**
 * 檢查該圖示是否為佔位/背景
 * @param {string} url
 * @returns {boolean}
 */
export function isDummyIcon(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return lower.includes("dummy") || lower.includes("back") || lower.includes("base");
}

/**
 * 從成績圖示 <img src> 解析 ScoreRank
 * @param {string} imgSrc
 * @returns {ScoreRank}
 */
export function parseScoreRankIcon(imgSrc) {
  if (!imgSrc || isDummyIcon(imgSrc)) return ScoreRank.D;
  const lower = imgSrc.toLowerCase();
  for (const [key, regex] of Object.entries(ICON_MAP.scoreRank)) {
    if (regex.test(lower)) {
      switch (key) {
        case "sss_plus": return ScoreRank.SSS_PLUS;
        case "sss": return ScoreRank.SSS;
        case "ss_plus": return ScoreRank.SS_PLUS;
        case "ss": return ScoreRank.SS;
        case "s_plus": return ScoreRank.S_PLUS;
        case "s": return ScoreRank.S;
        case "aaa": return ScoreRank.AAA;
        case "aa": return ScoreRank.AA;
        case "a": return ScoreRank.A;
        case "bb": return ScoreRank.BB;
        case "b": return ScoreRank.B;
        case "c": return ScoreRank.C;
        default: return ScoreRank.D;
      }
    }
  }
  return ScoreRank.D;
}

/**
 * 從 FC 圖示解析 FcType
 * @param {string} imgSrc
 * @returns {FcType}
 */
export function parseFcTypeIcon(imgSrc) {
  if (!imgSrc || isDummyIcon(imgSrc)) return FcType.NONE;
  const lower = imgSrc.toLowerCase();
  for (const [key, regex] of Object.entries(ICON_MAP.fc)) {
    if (regex.test(lower)) {
      switch (key) {
        case "fc_plus": return FcType.FC_PLUS;
        case "fc": return FcType.FC;
        case "ap_plus": return FcType.AP_PLUS;
        case "ap": return FcType.AP;
        default:
          return FcType.NONE;
      }
    }
  }
  return FcType.NONE;
}

/**
 * 從 SYNC/FS 圖示解析 SyncPlayType
 * @param {string} imgSrc
 * @returns {SyncPlayType}
 */
export function parseSyncPlayTypeIcon(imgSrc) {
  if (!imgSrc || isDummyIcon(imgSrc)) return SyncPlayType.NONE;
  const lower = imgSrc.toLowerCase();
  for (const [key, regex] of Object.entries(ICON_MAP.sync)) {
    if (regex.test(lower)) {
      switch (key) {
        case "fsd_plus": return SyncPlayType.FSD_PLUS;
        case "fsd": return SyncPlayType.FSD;
        case "fs_plus": return SyncPlayType.FS_PLUS;
        case "fs": return SyncPlayType.FS;
        case "sync": return SyncPlayType.SYNC;
        default:
          return SyncPlayType.NONE;
      }
    }
  }
  return SyncPlayType.NONE;
}

/**
 * 解析 CLEAR 圖示
 * @param {string} imgSrc
 * @returns {ClearType}
 */
export function parseClearTypeIcon(imgSrc) {
  if (!imgSrc) return ClearType.NOT_CLEAR;
  if (isDummyIcon(imgSrc)) return ClearType.NOT_CLEAR;
  const lower = imgSrc.toLowerCase();
  if (lower.includes("clear")) return ClearType.CLEAR;
  return ClearType.NOT_CLEAR;
}

/**
 * 從難度圖示 URL 解析 Difficulty
 * 範例：https://maimaidx-eng.com/maimai-mobile/img/diff_advanced.png
 * @param {string} imgSrc
 * @returns {Difficulty}
 */
export function parseDifficultyIcon(imgSrc) {
  if (!imgSrc) throw new Error("invalid difficulty icon src");
  const match = imgSrc.match(/diff_(\w+)\.png/);
  if (!match) throw new Error(`無法解析難度: ${imgSrc}`);
  switch (match[1].toLowerCase()) {
    case "basic": return Difficulty.BASIC;
    case "advanced": return Difficulty.ADVANCED;
    case "expert": return Difficulty.EXPERT;
    case "master": return Difficulty.MASTER;
    case "remaster": return Difficulty.RE_MASTER;
    default: return Difficulty.BASIC;
  }
}

/**
 * "99.7513%" → 99.7513
 * @param {string} text
 * @returns {number}
 */
export function parseAchievementText(text) {
  if (!text) return 0;
  return parseFloat(text.replace(/[%]/g, "").trim()) || 0;
}

/**
 * 從歌曲封面 URL 擷取 musicId
 * @param {string} url
 * @returns {string}
 */
export function extractMusicIdFromCoverUrl(url) {
  const match = url.match(/Music\/([a-zA-Z0-9]+)\.png/);
  if (match) return match[1];
  return "";
}

/**
 * 解析 "2,345 / 2,500" → [2345,2500]
 * @param {string} text
 * @returns {[number, number]}
 */
export function parseDeluxscoreText(text) {
  if (!text) return [0, 0];
  const cleaned = text.replace(/,/g, "").split("/");
  return [parseInt(cleaned[0]), parseInt(cleaned[1])];
}

/**
 * 將 LV 文字（如 "13+"）轉為顯示用字串或數值
 * @param {string} lvText
 * @returns {string}
 */
export function normalizeLevelText(lvText) {
  return lvText.trim();
} 