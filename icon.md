# 🎮 MaimaiB50Extension 圖標系統文件

## 📋 目錄
- [🎯 概述](#概述)
- [🎵 歌曲類型圖標](#歌曲類型圖標)
- [🎚️ 難度圖標](#難度圖標)
- [🏆 成績等級圖標](#成績等級圖標)
- [🎯 FC 類型圖標](#fc-類型圖標)
- [🔄 同步類型圖標](#同步類型圖標)
- [🥇 排名圖標](#排名圖標)
- [⭐ DX 星星圖標](#dx-星星圖標)
- [🎨 其他圖標](#其他圖標)
- [🔧 解析函數](#解析函數)
- [📝 圖標 URL 格式](#圖標-url-格式)
- [⚠️ 常見問題](#常見問題)

---

## 🎯 概述

MaimaiB50Extension 使用多種圖標來表示遊戲中的不同狀態和資訊。所有圖標都來自官方 maimai DX 網站，並透過特定的解析函數來識別和分類。

**基礎 URL 格式：**
```
https://maimaidx-eng.com/maimai-mobile/img/{category}/{icon_name}.png?ver={version}
```

---

## 🎵 歌曲類型圖標

### 📊 圖標類型
| 圖標檔名 | 類型 | 枚舉值 | 說明 |
|---------|------|--------|------|
| `music_dx.png` | DX | `MusicKind.DX` (0) | DX 版本歌曲 |
| `music_standard.png` | Standard | `MusicKind.STANDARD` (1) | 標準版本歌曲 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/music_dx.png
https://maimaidx-eng.com/maimai-mobile/img/music_standard.png
```

### 🛠️ 解析函數
```javascript
function parseMusicKindFromUrl(url)
```

---

## 🎚️ 難度圖標

### 📊 圖標類型
| 圖標檔名 | 難度 | 枚舉值 | 顏色 |
|---------|------|--------|------|
| `diff_basic.png` | Basic | `Difficulty.BASIC` (0) | 綠色 |
| `diff_advanced.png` | Advanced | `Difficulty.ADVANCED` (1) | 黃色 |
| `diff_expert.png` | Expert | `Difficulty.EXPERT` (2) | 紅色 |
| `diff_master.png` | Master | `Difficulty.MASTER` (3) | 紫色 |
| `diff_remaster.png` | Re:Master | `Difficulty.REMASTER` (4) | 白色 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/diff_basic.png
https://maimaidx-eng.com/maimai-mobile/img/diff_advanced.png
https://maimaidx-eng.com/maimai-mobile/img/diff_expert.png
https://maimaidx-eng.com/maimai-mobile/img/diff_master.png
https://maimaidx-eng.com/maimai-mobile/img/diff_remaster.png
```

### 🛠️ 解析函數
```javascript
function parseDifficultyFromUrl(url)
```

---

## 🏆 成績等級圖標

### 📊 圖標類型
| 圖標檔名 | 等級 | 枚舉值 | 達成率範圍 |
|---------|------|--------|-----------|
| `playlog/d.png` | D | `ScoreRank.D` (0) | 0% - 49.99% |
| `playlog/c.png` | C | `ScoreRank.C` (1) | 50% - 59.99% |
| `playlog/b.png` | B | `ScoreRank.B` (2) | 60% - 69.99% |
| `playlog/bb.png` | BB | `ScoreRank.BB` (3) | 70% - 74.99% |
| `playlog/bbb.png` | BBB | `ScoreRank.BBB` (4) | 75% - 79.99% |
| `playlog/a.png` | A | `ScoreRank.A` (5) | 80% - 89.99% |
| `playlog/aa.png` | AA | `ScoreRank.AA` (6) | 90% - 93.99% |
| `playlog/aaa.png` | AAA | `ScoreRank.AAA` (7) | 94% - 96.99% |
| `playlog/s.png` | S | `ScoreRank.S` (8) | 97% - 97.99% |
| `playlog/sp.png` | S+ | `ScoreRank.SP` (9) | 98% - 98.99% |
| `playlog/ss.png` | SS | `ScoreRank.SS` (10) | 99% - 99.49% |
| `playlog/ssp.png` | SS+ | `ScoreRank.SSP` (11) | 99.5% - 99.99% |
| `playlog/sss.png` | SSS | `ScoreRank.SSS` (12) | 100% |
| `playlog/sssp.png` | SSS+ | `ScoreRank.SSSP` (13) | 100% + 特殊條件 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/playlog/d.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/splus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/ssplus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/sssplus.png?ver=1.50
```

### 🛠️ 解析函數
```javascript
function parseScoreRankFromUrl(url)
```

### ⚠️ 特殊格式
- `splus` → S+
- `ssplus` → SS+
- `sssplus` → SSS+

---

## 🎯 FC 類型圖標

### 📊 圖標類型
| 圖標檔名 | 類型 | 枚舉值 | 說明 |
|---------|------|--------|------|
| `playlog/fc.png` | FC | `FcType.FC` (0) | Full Combo |
| `playlog/fcplus.png` | FC+ | `FcType.FCP` (1) | Full Combo Plus |
| `playlog/ap.png` | AP | `FcType.AP` (2) | All Perfect |
| `playlog/applus.png` | AP+ | `FcType.APP` (3) | All Perfect Plus |
| `playlog/fc_dummy.png` | 無 | `FcType.NONE` (4) | 未達成 FC |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/playlog/fc.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/fcplus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/ap.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/applus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/fc_dummy.png?ver=1.50
```

### 🛠️ 解析函數
```javascript
function parseFcTypeFromUrl(url)
```

### ⚠️ 特殊格式
- `fcplus` → FC+
- `applus` → AP+
- `fc_dummy` → 無 FC

---

## 🔄 同步類型圖標

### 📊 圖標類型
| 圖標檔名 | 類型 | 枚舉值 | 說明 |
|---------|------|--------|------|
| `playlog/sync.png` | FS | `SyncPlayType.FS` (0) | Full Sync |
| `playlog/fsplus.png` | FS+ | `SyncPlayType.FSP` (1) | Full Sync Plus |
| `playlog/fsd.png` | FSD | `SyncPlayType.FSD` (2) | Full Sync DX |
| `playlog/fsdplus.png` | FSD+ | `SyncPlayType.FSDP` (3) | Full Sync DX Plus |
| `playlog/sync_dummy.png` | 無 | `SyncPlayType.NONE` (4) | 未達成同步 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/playlog/sync.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/fsplus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/fsd.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/fsdplus.png?ver=1.50
https://maimaidx-eng.com/maimai-mobile/img/playlog/sync_dummy.png?ver=1.50
```

### 🛠️ 解析函數
```javascript
function parseSyncPlayTypeFromUrl(url)
```

### ⚠️ 特殊格式
- `sync.png` → FS（基礎同步）
- `fsplus` → FS+
- `fsdplus` → FSD+
- `sync_dummy` → 無同步

---

## 🥇 排名圖標

### 📊 圖標類型
| 圖標檔名 | 排名 | 枚舉值 | 說明 |
|---------|------|--------|------|
| `playlog/1st.png` | 1st | `PlayRank.FIRST` (0) | 第一名 |
| `playlog/2nd.png` | 2nd | `PlayRank.SECOND` (1) | 第二名 |
| `playlog/3rd.png` | 3rd | `PlayRank.THIRD` (2) | 第三名 |
| `playlog/4th.png` | 4th | `PlayRank.FOURTH` (3) | 第四名 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/playlog/1st.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/2nd.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/3rd.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/4th.png
```

### 🛠️ 解析函數
```javascript
function parsePlayRankFromUrl(url)
```

---

## ⭐ DX 星星圖標

### 📊 圖標類型
| 圖標檔名 | 星數 | 說明 |
|---------|------|------|
| `playlog/dxstar_1.png` | 1 星 | DX Score 1 星 |
| `playlog/dxstar_2.png` | 2 星 | DX Score 2 星 |
| `playlog/dxstar_3.png` | 3 星 | DX Score 3 星 |
| `playlog/dxstar_4.png` | 4 星 | DX Score 4 星 |
| `playlog/dxstar_5.png` | 5 星 | DX Score 5 星 |

### 🔗 URL 範例
```
https://maimaidx-eng.com/maimai-mobile/img/playlog/dxstar_1.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/dxstar_2.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/dxstar_3.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/dxstar_4.png
https://maimaidx-eng.com/maimai-mobile/img/playlog/dxstar_5.png
```

### 📊 統計圖標
| 圖標檔名 | 用途 |
|---------|------|
| `music_icon_dxstar_1.png` | 1 星統計 |
| `music_icon_dxstar_2.png` | 2 星統計 |
| `music_icon_dxstar_3.png` | 3 星統計 |
| `music_icon_dxstar_4.png` | 4 星統計 |
| `music_icon_dxstar_5.png` | 5 星統計 |

---

## 🎨 其他圖標

### 📊 系統圖標
| 圖標檔名 | 用途 | 說明 |
|---------|------|------|
| `playlog/clear.png` | 通關標記 | 表示歌曲已通關 |
| `playlog/achievement.png` | 達成率標記 | 顯示達成率 |
| `playlog/deluxscore.png` | DX Score 標記 | 顯示 DX Score |
| `playlog/newrecord.png` | 新記錄標記 | 表示創下新記錄 |

### 📊 背景圖標
| 圖標檔名 | 用途 | 說明 |
|---------|------|------|
| `music_icon_back.png` | 背景圖標 | 用於背景顯示 |
| `music_icon_dummy.png` | 佔位圖標 | 用於佔位顯示 |
| `music_icon_base.png` | 基礎圖標 | 基礎圖標樣式 |

---

## 🔧 解析函數

### 🎵 歌曲類型解析
```javascript
function parseMusicKindFromUrl(url) {
    if (url.includes('music_dx.png')) {
        return MusicKind.DX;
    } else if (url.includes('music_standard.png')) {
        return MusicKind.STANDARD;
    }
    throw new Error(`Invalid music kind url: ${url}`);
}
```

### 🎚️ 難度解析
```javascript
function parseDifficultyFromUrl(url) {
    const match = url.match(/diff_(\w+)\.png/);
    if (!match) {
        throw new Error(`Invalid difficulty url: ${url}`);
    }
    
    const difficultyName = match[1];
    switch (difficultyName) {
        case 'basic': return Difficulty.BASIC;
        case 'advanced': return Difficulty.ADVANCED;
        case 'expert': return Difficulty.EXPERT;
        case 'master': return Difficulty.MASTER;
        case 'remaster': return Difficulty.REMASTER;
        default: throw new Error(`Unknown difficulty: ${difficultyName}`);
    }
}
```

### 🏆 成績等級解析
```javascript
function parseScoreRankFromUrl(url) {
    // 處理背景圖標
    if (url.includes('back') || url.includes('dummy') || url.includes('base')) {
        return ScoreRank.D;
    }
    
    const match = url.match(/playlog\/(\w+)\.png/);
    if (!match) {
        throw new Error(`Invalid song rank url: ${url}`);
    }
    
    const rankName = match[1];
    switch (rankName) {
        case 'd': return ScoreRank.D;
        case 'c': return ScoreRank.C;
        case 'b': return ScoreRank.B;
        case 'bb': return ScoreRank.BB;
        case 'bbb': return ScoreRank.BBB;
        case 'a': return ScoreRank.A;
        case 'aa': return ScoreRank.AA;
        case 'aaa': return ScoreRank.AAA;
        case 's': return ScoreRank.S;
        case 'sp': case 'splus': return ScoreRank.SP;
        case 'ss': return ScoreRank.SS;
        case 'ssp': case 'ssplus': return ScoreRank.SSP;
        case 'sss': return ScoreRank.SSS;
        case 'sssp': case 'sssplus': return ScoreRank.SSSP;
        default: throw new Error(`Unknown song rank: ${rankName}`);
    }
}
```

### 🎯 FC 類型解析
```javascript
function parseFcTypeFromUrl(url) {
    if (url.includes('fc_dummy')) {
        return FcType.NONE;
    }
    
    const match = url.match(/playlog\/(\w+)\.png/);
    if (!match) {
        throw new Error(`Invalid fc type url: ${url}`);
    }
    
    const fcName = match[1];
    switch (fcName) {
        case 'fc': return FcType.FC;
        case 'fcp': case 'fcplus': return FcType.FCP;
        case 'ap': return FcType.AP;
        case 'app': case 'applus': return FcType.APP;
        default: throw new Error(`Unknown fc type: ${fcName}`);
    }
}
```

### 🔄 同步類型解析
```javascript
function parseSyncPlayTypeFromUrl(url) {
    if (url.includes('sync_dummy')) {
        return SyncPlayType.NONE;
    }
    
    const match = url.match(/playlog\/(\w+)\.png/);
    if (!match) {
        throw new Error(`Invalid sync play type url: ${url}`);
    }
    
    const syncName = match[1];
    switch (syncName) {
        case 'sync': return SyncPlayType.FS;
        case 'fsp': case 'fsplus': return SyncPlayType.FSP;
        case 'fsd': return SyncPlayType.FSD;
        case 'fsdp': case 'fsdplus': return SyncPlayType.FSDP;
        default: throw new Error(`Unknown sync play type: ${syncName}`);
    }
}
```

### 🥇 排名解析
```javascript
function parsePlayRankFromUrl(url) {
    const match = url.match(/playlog\/(\w+)\.png/);
    if (!match) {
        throw new Error(`Invalid play rank url: ${url}`);
    }
    
    const rankName = match[1];
    switch (rankName) {
        case '1st': return PlayRank.FIRST;
        case '2nd': return PlayRank.SECOND;
        case '3rd': return PlayRank.THIRD;
        case '4th': return PlayRank.FOURTH;
        default: throw new Error(`Unknown play rank: ${rankName}`);
    }
}
```

---

## 📝 圖標 URL 格式

### 🌐 基礎 URL 結構
```
https://maimaidx-eng.com/maimai-mobile/img/{path}/{filename}.png?ver={version}
```

### 📂 路徑分類
| 路徑 | 用途 | 範例 |
|------|------|------|
| `/` | 根目錄 | 歌曲類型、難度圖標 |
| `/playlog/` | 遊戲記錄 | 成績、FC、同步、排名圖標 |

### 🔢 版本參數
- `?ver=1.50` - 當前版本
- 版本參數用於快取控制
- 可能會隨遊戲更新而變化

---

## ⚠️ 常見問題

### ❌ 解析錯誤
1. **背景圖標誤判**
   - 問題：`music_icon_back.png` 被當作成績等級解析
   - 解決：在解析函數中加入背景圖標過濾

2. **特殊格式處理**
   - 問題：`splus`、`ssplus`、`sssplus` 格式不被識別
   - 解決：在 switch 語句中加入特殊格式對應

3. **Dummy 圖標處理**
   - 問題：`fc_dummy.png`、`sync_dummy.png` 解析失敗
   - 解決：優先檢查 dummy 關鍵字

### 🔧 最佳實踐
1. **圖標分類順序**
   ```javascript
   // 正確順序：特殊 → 一般 → 預設
   if (url.includes('sync_dummy')) return SyncPlayType.NONE;
   if (url.includes('sync')) return SyncPlayType.FS;
   ```

2. **錯誤處理**
   ```javascript
   try {
       const rank = parseScoreRankFromUrl(url);
   } catch (error) {
       console.warn('Unable to parse icon:', url, error.message);
       return defaultValue;
   }
   ```

3. **URL 驗證**
   ```javascript
   if (!url || !url.includes('maimaidx-eng.com')) {
       throw new Error('Invalid icon URL');
   }
   ```

---

## 📚 相關文件
- [API 文件](api.md) - 完整 API 說明
- [README](README.md) - 專案概述
- [變更記錄](log/) - 開發歷程

---

*最後更新：2025-01-27*
*版本：1.0.0* 