// 主機與路徑常數
export const MAIMAI_HOST = "https://maimaidx-eng.com";
export const MAIMAI_RECORD_URL = `${MAIMAI_HOST}/maimai-mobile/record/`;

// 依難度搜尋最佳成績
export const MAIMAI_RECORD_BEST_BASE = `${MAIMAI_RECORD_URL}musicMybest/search/?diff=`;
// 依難度搜尋歌曲排序（已遊玩）
export const MAIMAI_RECORD_MUSIC_SORT_BASE = `${MAIMAI_RECORD_URL}musicSort/search/?search=A&sort=1&playCheck=on&diff=`;
// 最近紀錄固定網址
export const MAIMAI_RECORD_RECENT_URL = `${MAIMAI_RECORD_URL}`;

// --------------------
// 枚舉定義
// --------------------
// 注意：依專案慣例使用 SCREAMING_SNAKE_CASE 以強調不可變枚舉。

export const Difficulty = Object.freeze({
  BASIC: 0,
  ADVANCED: 1,
  EXPERT: 2,
  MASTER: 3,
  RE_MASTER: 4,
  ALL: 99,
});

export const ClearType = Object.freeze({
  NOT_CLEAR: 0,
  CLEAR: 1,
});

export const MusicKind = Object.freeze({
  DX: 0,
  STD: 1,
});

export const ScoreRank = Object.freeze({
  D: 0,
  C: 1,
  B: 2,
  BB: 3,
  A: 4,
  AA: 5,
  AAA: 6,
  S: 7,
  S_PLUS: 8, // S+
  SS: 9,
  SS_PLUS: 10, // SS+
  SSS: 11,
  SSS_PLUS: 12, // SSS+
});

export const FcType = Object.freeze({
  NONE: 0,
  FC: 1,
  FC_PLUS: 2,
  AP: 3,
  AP_PLUS: 4,
});

export const SyncPlayType = Object.freeze({
  NONE: 0,
  SYNC: 1,
  FS: 2,
  FS_PLUS: 3,
  FSD: 4,
  FSD_PLUS: 5,
});

export const MusicCategory = Object.freeze({
  DEFAULT: 0, // 之後若有需要再補完（Shirako: 補完了）
  POPS: 1,
  Nico: 2,
  Touhou: 3,
  Variety: 4,
  maimai: 5,
  geki_chu: 6,
});

// --------------------
// 圖示對應表（部分列舉，若有新增請擴充）
// --------------------
export const ICON_MAP = {
  // Score Rank
  scoreRank: {
    sss_plus: /sssplus\.png|sss_plus\.png/,
    sss: /sss\.png/,
    ss_plus: /ssplus\.png|ss_plus\.png/,
    ss: /ss\.png/,
    s_plus: /splus\.png|s_plus\.png/,
    s: /s\.png/,
    aaa: /aaa\.png/,
    aa: /aa\.png/,
    a: /a\.png/,
    bb: /bb\.png/,
    b: /b\.png/,
    c: /c\.png/,
    d: /d\.png/,
  },
  // FC
  fc: {
    fc_plus: /fcplus\.png|fc_plus\.png/,
    fc: /fc\.png/,
    ap_plus: /applus\.png|ap_plus\.png/,
    ap: /ap\.png/,
  },
  // SYNC / FS
  sync: {
    fsd_plus: /fsdp\.png/,
    fsd: /fsd\.png/,
    fs_plus: /fsp\.png/,
    fs: /fs\.png/,
    sync: /sync\.png/,
  },
};

// 檢查是否在官方網站的輔助函式 (非導出)
export function ensureAbleToExecute() {
  if (!document.URL.includes(MAIMAI_HOST)) {
    console.warn(`目前頁面非 maimai 官方網站，URL: ${document.URL}`);
    return false;
  }
  return true;
}

export function ensureAbleToExecuteOrThrow() {
  if (!ensureAbleToExecute()) {
    throw new Error(`not on maimai site, url: ${document.URL}`);
  }
} 