# Maimai B50 Extension API 文件

**版本：** 1.2  
**基礎 URL：** `https://maimaidx-eng.com/maimai-mobile/`  
**描述：** maimai DX 成績分析擴充功能的完整 API 文件

---

## 📋 目錄

- [核心 API](#核心-api)
- [解析函數](#解析函數)
- [輔助函數](#輔助函數)
- [顯示函數](#顯示函數)
- [資料結構](#資料結構)
- [枚舉定義](#枚舉定義)
- [錯誤處理](#錯誤處理)

---

## 核心 API

### `getBasicRecords()`

獲取使用者最近的遊戲記錄

**HTTP 方法：** `GET`  
**端點：** `/record/`  
**描述：** 從 maimai DX 記錄頁面解析最近的遊戲記錄

#### 參數
無

#### 返回值
```typescript
Promise<Array<BasicRecord>>
```

#### 範例
```javascript
// 使用方式
const records = await getBasicRecords();
console.log(records[0]);
// 輸出範例:
{
    difficulty: 3,           // master
    trackNumber: 4,
    playTime: "2024-01-15T10:30:00.000Z",
    clearType: 1,           // clear
    displayName: "Oshama Scramble!",
    musicId: "a5c6705e2bfa3419",
    musicKind: 0,           // dx
    scoreRank: 11,          // sss
    achievementPercent: 100.5000,
    isAchievementNewRecord: false,
    fcType: 4,              // app (AP+)
    syncPlayType: 5,        // fsdp (FSD+)
    syncPlayRank: 1,
    isDeluxscoreNewRecord: false,
    deluxscoreMax: 2500,
    deluxscore: 2485,
    detailId: "12345"
}
```

#### 錯誤
- `Error: not on maimai site` - 不在 maimai DX 網站上
- `Error: response error, status: 404` - 網路請求失敗

---

### `getAllRecordsBySearch(cooldown)`

獲取各難度前 10 名最佳成績

**HTTP 方法：** `GET`  
**端點：** `/record/musicSort/search/`  
**描述：** 批次獲取所有難度的最佳成績記錄

#### 參數
| 參數名 | 類型 | 必填 | 預設值 | 描述 |
|--------|------|------|--------|------|
| `cooldown` | `number` | ❌ | `400` | 請求間隔時間（毫秒） |

#### 返回值
```typescript
Promise<Array<BasicRecord>>
```

#### 範例
```javascript
// 使用方式
const records = await getAllRecordsBySearch(500);

// 返回結果 - 按難度分組的前10名記錄
{
    0: [...],  // basic 難度前10名
    1: [...],  // advanced 難度前10名  
    2: [...],  // expert 難度前10名
    3: [...],  // master 難度前10名
    4: [...]   // remaster 難度前10名
}
```

#### 錯誤
- `Error: not on maimai site` - 不在 maimai DX 網站上
- `Error: Loading {difficulty} records failed` - 特定難度載入失敗

---

### `getDetailedMusicRecord(idx)`

獲取特定歌曲的詳細記錄

**HTTP 方法：** `GET`  
**端點：** `/record/musicDetail/`  
**描述：** 獲取單首歌曲在所有難度的詳細成績資料

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `idx` | `string` | ✅ | 歌曲索引 ID |

#### 返回值
```typescript
Promise<DetailedRecord>
```

#### 範例
```javascript
// 使用方式
const detailedRecord = await getDetailedMusicRecord("12345");

// 返回結果
{
  musicId: "a5c6705e2bfa3419",
  songDisplayName: "Oshama Scramble!",
  songArtist: "t+pazolite",
  subRecords: Map {
    3 => {  // MASTER 難度
      difficulty: 3,
      musicKind: 0,
      songDisplayLevel: 13,
      scoreRank: 11,
      fcType: 4,
      syncPlayType: 5,
      lastPlayDate: "2025-01-27T10:30:00Z",
      playCount: 25,
      achievementPercent: 100.5000,
      deluxscore: 2485,
      deluxscoreMax: 2500
    }
  }
}
```

---

## 解析函數

### `parseDifficultyFromUrl(url)`

從圖片 URL 解析難度

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | 難度圖片 URL |

#### 返回值
```typescript
Difficulty
```

#### 範例
```javascript
// 使用方式
const difficulty = parseDifficultyFromUrl("https://maimaidx-eng.com/maimai-mobile/img/diff_master.png");
// 返回: 3 (Difficulty.master)

// 支援的格式
"diff_basic.png"     → Difficulty.basic (0)
"diff_advanced.png"  → Difficulty.advanced (1)
"diff_expert.png"    → Difficulty.expert (2)
"diff_master.png"    → Difficulty.master (3)
"diff_remaster.png"  → Difficulty.remaster (4)
```

---

### `parseScoreRankFromUrl(url)`

從圖片 URL 解析成績等級

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | 成績等級圖片 URL |

#### 返回值
```typescript
ScoreRank
```

#### 範例
```javascript
// 使用方式
const rank = parseScoreRankFromUrl("https://maimaidx-eng.com/maimai-mobile/img/playlog/ssp.png?ver=1.50");
// 返回: 10 (ScoreRank.ssp)

// 支援的圖標格式 - playlog 路徑
"playlog/d.png"      → ScoreRank.d (0)
"playlog/c.png"      → ScoreRank.c (1)
"playlog/b.png"      → ScoreRank.b (2)
"playlog/bb.png"     → ScoreRank.bb (3)
"playlog/a.png"      → ScoreRank.a (4)
"playlog/aa.png"     → ScoreRank.aa (5)
"playlog/aaa.png"    → ScoreRank.aaa (6)
"playlog/s.png"      → ScoreRank.s (7)     // S
"playlog/sp.png"     → ScoreRank.sp (8)    // S+
"playlog/ss.png"     → ScoreRank.ss (9)    // SS
"playlog/ssp.png"    → ScoreRank.ssp (10)  // SS+
"playlog/sss.png"    → ScoreRank.sss (11)  // SSS
"playlog/sssp.png"   → ScoreRank.sssp (12) // SSS+

// 支援的圖標格式 - music_icon 路徑
"music_icon_d.png"    → ScoreRank.d (0)
"music_icon_c.png"    → ScoreRank.c (1)
"music_icon_b.png"    → ScoreRank.b (2)
"music_icon_bb.png"   → ScoreRank.bb (3)
"music_icon_a.png"    → ScoreRank.a (4)
"music_icon_aa.png"   → ScoreRank.aa (5)
"music_icon_aaa.png"  → ScoreRank.aaa (6)
"music_icon_s.png"    → ScoreRank.s (7)     // S
"music_icon_sp.png"   → ScoreRank.sp (8)    // S+
"music_icon_ss.png"   → ScoreRank.ss (9)    // SS
"music_icon_ssp.png"  → ScoreRank.ssp (10)  // SS+
"music_icon_sss.png"  → ScoreRank.sss (11)  // SSS
"music_icon_sssp.png" → ScoreRank.sssp (12) // SSS+

// 特殊處理
"music_icon_back.png" → ScoreRank.d (0)     // 背景圖片，返回預設值
"music_icon_dummy.png" → ScoreRank.d (0)    // 虛擬圖片，返回預設值
```

---

### `parseFcTypeFromUrl(url)`

從圖片 URL 解析 FC 類型

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | FC 類型圖片 URL |

#### 返回值
```typescript
FcType
```

#### 範例
```javascript
// 使用方式
const fcType = parseFcTypeFromUrl("https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png?ver=1.50");
// 返回: 4 (FcType.app)

// 支援的圖標格式
"music_icon_fc.png"  → FcType.fc (1)
"music_icon_fcp.png" → FcType.fcp (2)
"music_icon_ap.png"  → FcType.ap (3)
"music_icon_app.png" → FcType.app (4)
"music_icon_back.png" → FcType.NONE (0) // 背景圖片
```

---

### `parseSyncPlayTypeFromUrl(url)`

從圖片 URL 解析同步類型

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | 同步類型圖片 URL |

#### 返回值
```typescript
SyncPlayType
```

#### 範例
```javascript
// 使用方式
const syncType = parseSyncPlayTypeFromUrl("https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png?ver=1.50");
// 返回: 5 (SyncPlayType.fsdp)

// 支援的圖標格式
"music_icon_sync.png" → SyncPlayType.sync (1)
"music_icon_fs.png"   → SyncPlayType.fs (2)
"music_icon_fsp.png"  → SyncPlayType.fsp (3)
"music_icon_fsd.png"  → SyncPlayType.fsd (4)
"music_icon_fsdp.png" → SyncPlayType.fsdp (5)
"music_icon_back.png" → SyncPlayType.NONE (0) // 背景圖片
```

---

### `parseMusicKindFromUrl(url)`

從圖片 URL 解析歌曲類型

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | 歌曲類型圖片 URL |

#### 返回值
```typescript
MusicKind
```

#### 範例
```javascript
// 使用方式
const musicKind = parseMusicKindFromUrl("https://maimaidx-eng.com/maimai-mobile/img/music_dx.png");
// 返回: 0 (MusicKind.DX)

// 支援的圖標格式
"music_dx.png"       → MusicKind.DX (0)
"music_standard.png" → MusicKind.STANDARD (1)
```

---

### `parseMusicIdFromUrl(url)`

從圖片 URL 解析歌曲 ID

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `url` | `string` | ✅ | 歌曲封面圖片 URL |

#### 返回值
```typescript
string
```

#### 範例
```javascript
// 使用方式
const musicId = parseMusicIdFromUrl("https://maimaidx-eng.com/maimai-mobile/img/Music/a5c6705e2bfa3419.png");
// 返回: "a5c6705e2bfa3419"
```

---

## 輔助函數

### `ensureAbleToExecute()`

檢查是否在 maimai DX 網站上

#### 參數
無

#### 返回值
```typescript
boolean
```

#### 範例
```javascript
// 使用方式
if (ensureAbleToExecute()) {
    // 可以執行 API 函數
    const records = await getBasicRecords();
} else {
    console.warn("請在 maimai DX 網站上執行");
}
```

---

### `ensureAbleToExecuteOrThrow()`

檢查是否在 maimai DX 網站上，否則拋出錯誤

#### 參數
無

#### 返回值
```typescript
void
```

#### 錯誤
- `Error: not on maimai site` - 不在 maimai DX 網站上

#### 範例
```javascript
// 使用方式
try {
    ensureAbleToExecuteOrThrow();
    const records = await getBasicRecords();
} catch (error) {
    console.error("錯誤:", error.message);
}
```

---

### `getDifficultyText(difficulty)`

獲取難度的文字描述

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `difficulty` | `Difficulty` | ✅ | 難度枚舉值 |

#### 返回值
```typescript
string
```

#### 範例
```javascript
// 使用方式
const text = getDifficultyText(Difficulty.master);
// 返回: "Master"

// 支援的轉換
Difficulty.basic     → "Basic"
Difficulty.advanced  → "Advanced"
Difficulty.expert    → "Expert"
Difficulty.master    → "Master"
Difficulty.remaster  → "Re:Master"
```

---

### URL 生成函數

#### `getPlayDetailUrl(playlogId)`
```javascript
// 生成遊戲詳細記錄 URL
const url = getPlayDetailUrl("12345");
// 返回: "https://maimaidx-eng.com/maimai-mobile/record/playlogDetail/?idx=12345"
```

#### `getBestRecordSearchUrl(difficulty)`
```javascript
// 生成最佳成績搜尋 URL
const url = getBestRecordSearchUrl(Difficulty.master);
// 返回: "https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3"
```

#### `getMusicSortUrl(difficulty)`
```javascript
// 生成歌曲排序 URL
const url = getMusicSortUrl(Difficulty.expert);
// 返回: "https://maimaidx-eng.com/maimai-mobile/record/musicSort/search/?genre=99&diff=2"
```

#### `getMusicDetailUrl(idx)`
```javascript
// 生成歌曲詳細 URL
const url = getMusicDetailUrl("12345");
// 返回: "https://maimaidx-eng.com/maimai-mobile/record/musicDetail/?idx=12345"
```

---

## 顯示函數

### `displayResults(title, data)`

在網頁上顯示結果

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | `string` | ✅ | 顯示標題 |
| `data` | `Array<BasicRecord>` | ✅ | 記錄資料陣列 |

#### 返回值
```typescript
void
```

#### 範例
```javascript
// 使用方式
const records = await getBasicRecords();
displayResults("最近記錄", records);

// 效果
// 1. 在網頁右上角創建浮動顯示區域
// 2. 在 Console 輸出詳細資料
// 3. 顯示格式化的記錄卡片
```

---

### `formatRecordsForDisplay(records)`

格式化記錄資料用於顯示

#### 參數
| 參數名 | 類型 | 必填 | 描述 |
|--------|------|------|------|
| `records` | `Array<BasicRecord>` | ✅ | 記錄資料陣列 |

#### 返回值
```typescript
string
```

#### 範例
```javascript
// 使用方式
const records = await getBasicRecords();
const html = formatRecordsForDisplay(records);

// 返回 HTML 字串
`<div style="margin-bottom: 8px; padding: 8px; border-left: 3px solid #ff69b4; background: white;">
    <div style="font-weight: bold; margin-bottom: 3px;">Oshama Scramble!</div>
    <div style="font-size: 11px; color: #666;">MASTER | DX | SSS | 100.5000%</div>
    <div style="font-size: 10px; color: #888;">DX Score: 2485 / 2500</div>
</div>`
```

---

## 資料結構

### `BasicRecord`

基本記錄資料結構

```typescript
class BasicRecord {
    difficulty: Difficulty;          // 難度
    musicCategory: MusicCategory;    // 歌曲分類
    trackNumber: number;             // 曲目編號
    playTime: Date;                  // 遊玩時間
    clearType: ClearType;            // 通關類型
    displayName: string;             // 歌曲名稱
    musicId: string;                 // 歌曲 ID
    musicKind: MusicKind;            // 歌曲類型 (DX/Standard)
    scoreRank: ScoreRank;            // 成績等級
    achievementPercent: number;      // 達成率百分比
    isAchievementNewRecord: boolean; // 是否為達成率新記錄
    fcType: FcType;                  // FC 類型
    syncPlayType: SyncPlayType;      // 同步類型
    syncPlayRank: number;            // 同步排名
    isDeluxscoreNewRecord: boolean;  // 是否為 DX 分數新記錄
    deluxscoreMax: number;           // DX 最高分數
    deluxscore: number;              // DX 分數
    detailId: string;                // 詳細記錄 ID
}
```

### `DetailedRecord`

詳細記錄資料結構

```typescript
class DetailedRecord {
    musicId: string;                              // 歌曲 ID
    songDisplayName: string;                      // 歌曲名稱
    songArtist: string;                          // 歌曲藝術家
    subRecords: Map<Difficulty, DetailedRecordInner>; // 各難度記錄
}
```

### `DetailedRecordInner`

詳細記錄內部資料結構

```typescript
class DetailedRecordInner {
    difficulty: Difficulty;        // 難度
    musicKind: MusicKind;         // 歌曲類型
    songDisplayLevel: number;     // 歌曲等級
    scoreRank: ScoreRank;         // 成績等級
    fcType: FcType;               // FC 類型
    syncPlayType: SyncPlayType;   // 同步類型
    lastPlayDate: Date;           // 最後遊玩日期
    playCount: number;            // 遊玩次數
    achievementPercent: number;   // 達成率百分比
    deluxscore: number;           // DX 分數
    deluxscoreMax: number;        // DX 最高分數
}
```

---

## 枚舉定義

### `Difficulty` 枚舉
```javascript
const Difficulty = {
    basic: 0,      // 綠譜
    advanced: 1,   // 黃譜
    expert: 2,     // 紅譜
    master: 3,     // 紫譜
    remaster: 4,   // 白譜
    all: 99        // 全部難度
};
```

### `ScoreRank` 枚舉
```javascript
const ScoreRank = {
    d: 0, c: 1, b: 2, bb: 3, a: 4, aa: 5, aaa: 6,
    s: 7, sp: 8, ss: 9, ssp: 10, sss: 11, sssp: 12
};
```

### `FcType` 枚舉
```javascript
const FcType = {
    none: 0,   // 無 FC
    fc: 1,     // FC
    fcp: 2,    // FC+
    ap: 3,     // AP
    app: 4     // AP+
};
```

### `SyncPlayType` 枚舉
```javascript
const SyncPlayType = {
    none: 0,   // 無同步
    sync: 1,   // SYNC
    fs: 2,     // FS
    fsp: 3,    // FS+
    fsd: 4,    // FSD
    fsdp: 5    // FSD+
};
```

### `MusicKind` 枚舉
```javascript
const MusicKind = {
    dx: 0,         // DX 譜面
    standard: 1    // Standard 譜面
};
```

### `ClearType` 枚舉
```javascript
const ClearType = {
    not_clear: 0,  // 未通關
    clear: 1       // 已通關
};
```

---

## 錯誤處理

### 常見錯誤類型

#### 網站檢查錯誤
```javascript
Error: "not on maimai site, url: {current_url}"
```
**原因：** 不在 maimai DX 官方網站上執行  
**解決：** 請在 `https://maimaidx-eng.com/` 上執行

#### 網路請求錯誤
```javascript
Error: "response error, status: {status_code}"
```
**原因：** HTTP 請求失敗  
**解決：** 檢查網路連線和網站狀態

#### 圖標解析錯誤
```javascript
Error: "Invalid song rank url: {url}"
Error: "Invalid fc type url: {url}"
Error: "Invalid sync play type url: {url}"
```
**原因：** 無法解析圖標 URL  
**解決：** 檢查圖標 URL 格式是否正確

#### 資料解析錯誤
```javascript
Error: "Invalid difficulty url: {url}"
Error: "Invalid track number text: {text}"
Error: "Invalid clear type url: {url}"
```
**原因：** 無法解析網頁資料  
**解決：** 確認網頁結構是否有變更

### 錯誤處理最佳實踐

```javascript
// 1. 使用 try-catch 包裝 API 呼叫
try {
    const records = await getBasicRecords();
    displayResults("最近記錄", records);
} catch (error) {
    console.error("載入記錄失敗:", error.message);
}

// 2. 檢查執行環境
if (!ensureAbleToExecute()) {
    console.warn("請在 maimai DX 網站上執行");
    return;
}

// 3. 處理空資料
const records = await getBasicRecords();
if (records.length === 0) {
    console.log("沒有找到記錄");
    return;
}

// 4. 設定適當的請求間隔
const bestRecords = await getAllRecordsBySearch(1000); // 1秒間隔
```

---

## 使用範例

### 完整使用流程

```