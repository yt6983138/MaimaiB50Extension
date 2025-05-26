# Maimai B50 Extension

一個用於分析 maimai DX 音樂遊戲成績的 Chrome 瀏覽器擴充功能。

## 📋 專案概述

Maimai B50 Extension 是一個專為 maimai DX 玩家設計的瀏覽器擴充功能，能夠自動解析官方網站的成績資料，並提供便捷的成績查看和分析功能。

### ✨ 主要功能

- **最近記錄載入**：快速獲取最近的遊戲記錄
- **最佳成績分析**：載入各難度前 10 名最佳成績
- **即時顯示**：在網頁上浮動顯示結果，同時輸出到 Console
- **詳細解析**：完整解析成績等級、FC 類型、同步類型等資訊
- **多難度支援**：支援 basic、advanced、expert、master、remaster 所有難度

## 🚀 安裝方式

### 開發者模式安裝

1. 下載或 clone 此專案到本地
2. 開啟 Chrome 瀏覽器，進入 `chrome://extensions/`
3. 開啟右上角的「開發者模式」
4. 點擊「載入未封裝項目」
5. 選擇專案的 `src` 資料夾
6. 擴充功能安裝完成

### 使用前準備

1. 前往 [maimai DX 官方網站](https://maimaidx-eng.com/)
2. 登入您的帳號
3. 確保您在成績相關頁面（如記錄頁面）

## 📖 使用方式
### 使用Extension Popup

1. 點擊瀏覽器工具列中的擴充功能圖示
2. 在彈出視窗中點擊對應按鈕：
   - **載入最近記錄**：獲取最近的遊戲記錄
   - **載入最佳成績**：獲取各難度前 10 名成績
3. 結果會顯示在網頁右上角的浮動區域

## 🔧 API 端點
詳情在 [API.md](api.md)

## 🏗️ 內部原理

### 架構設計

專案採用模組化設計，主要分為三個核心檔案：

```
src/
├── api.js          # 核心 API 和資料解析邏輯
├── content.js      # 內容腳本，處理網頁互動和顯示
├── popup.js        # 彈出視窗邏輯
├── popup.html      # 彈出視窗介面
├── popup.css       # 樣式檔案
└── manifest.json   # 擴充功能配置
```

### 資料流程

1. **使用者觸發** → Popup 按鈕點擊或 Console 指令
2. **權限檢查** → 確認在 maimai DX 官方網站
3. **資料獲取** → 透過 fetch API 獲取網頁內容
4. **DOM 解析** → 解析 HTML 結構提取成績資料
5. **資料處理** → 格式化和驗證資料
6. **結果顯示** → 在網頁浮動區域和 Console 顯示

### 核心資料結構

#### BasicRecord 類別
```javascript
class BasicRecord {
    difficulty          // 難度 (Difficulty enum)
    trackNumber         // 曲目編號
    playTime           // 遊玩時間
    clearType          // 通關類型
    displayName        // 歌曲名稱
    musicId            // 歌曲 ID
    musicKind          // 歌曲類型 (DX/Standard)
    scoreRank          // 成績等級 (D~SSS+)
    achievementPercent // 達成率百分比
    fcType             // FC 類型 (FC/FC+/AP/AP+)
    syncPlayType       // 同步類型 (SYNC/FS/FS+/FSD/FSD+)
    deluxscore         // DX 分數
    deluxscoreMax      // DX 最高分數
    detailId           // 詳細記錄 ID
}
```

#### 枚舉定義
```javascript
// 難度
const Difficulty = {
    basic: 0, advanced: 1, expert: 2,
    master: 3, remaster: 4, all: 99
};

// 成績等級
const ScoreRank = {
    d: 0, c: 1, b: 2, bb: 3, a: 4, aa: 5, aaa: 6,
    s: 7, sp: 9, ss: 10, ssp: 11, sss: 12, sssp: 13
};

// FC 類型
const FcType = {
    NONE: 0, fc: 1, fcp: 2, ap: 3, app: 4
};

// 同步類型
const SyncPlayType = {
    NONE: 0, sync: 1, fs: 2, fsp: 3, fsd: 4, fsdp: 5
};
```

### 圖標解析邏輯

擴充功能能夠解析 maimai DX 網站上的各種圖標：

#### 分數等級圖標
- `music_icon_sss.png` → SSS
- `music_icon_ssp.png` → SS+
- `music_icon_ss.png` → SS
- `music_icon_sp.png` → S+
- `music_icon_s.png` → S
- `music_icon_aaa.png` → AAA
- `music_icon_aa.png` → AA
- `music_icon_a.png` → A
- `music_icon_bbb.png` → BBB
- `music_icon_bb.png` → BB
- `music_icon_b.png` → B
- `music_icon_c.png` → C
- `music_icon_d.png` → D


#### FC 類型圖標
- `music_icon_fc.png` → FC
- `music_icon_fcp.png` → FC+
- `music_icon_ap.png` → AP
- `music_icon_app.png` → AP+

#### 同步類型圖標
- `music_icon_sync.png` → SYNC
- `music_icon_fs.png` → FS
- `music_icon_fsp.png` → FS+
- `music_icon_fsd.png` → FSD
- `music_icon_fsdp.png` → FSD+

### 錯誤處理

- **網站檢查**：確保在正確的 maimai DX 網站上執行
- **圖標解析**：跳過背景圖片和無效圖標
- **資料驗證**：驗證解析結果的有效性
- **網路錯誤**：處理請求失敗和超時情況
- **使用者友善**：提供清楚的錯誤訊息和狀態提示

### 效能最佳化

- **請求間隔**：在批次請求間加入延遲避免伺服器負載
- **DOM 清理**：移除不必要的 DOM 元素減少記憶體使用
- **快取機制**：避免重複解析相同資料
- **條件式載入**：只在需要時載入特定功能

## 🛠️ 開發資訊

### 技術棧
- **JavaScript ES6+**：核心開發語言
- **Chrome Extension Manifest V3**：擴充功能框架
- **DOM Parser**：HTML 解析
- **CSS3**：樣式設計

### 專案結構
```
MaimaiB50Extension/
├── src/                    # 原始碼
│   ├── api.js             # 核心 API
│   ├── content.js         # 內容腳本
│   ├── popup.js           # 彈出視窗邏輯
│   ├── popup.html         # 彈出視窗介面
│   ├── popup.css          # 樣式檔案
│   ├── manifest.json      # 擴充功能配置
│   └── icon.png           # 圖示檔案
├── log/                   # 變更記錄（本地）
├── .gitignore            # Git 忽略檔案
├── LICENSE               # 授權檔案
└── README.md             # 說明文件
```

### 開發規範
- 使用繁體中文（台灣）作為主要語言
- 變數名稱使用英文，註解使用繁體中文
- 所有變更記錄存放在 `/log` 資料夾
- 遵循 Chrome Extension 最佳實踐

## 📝 變更記錄

詳細的變更記錄請參考 `/log` 資料夾中的 Markdown 檔案。

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 📄 授權

本專案採用 MIT 授權條款，詳見 [LICENSE](LICENSE) 檔案。

## ⚠️ 注意事項

- 本擴充功能僅供個人使用，請勿用於商業用途
- 使用時請遵守 maimai DX 官方網站的使用條款
- 建議適度使用，避免對官方伺服器造成過大負載
- 本專案與 SEGA 或 maimai DX 官方無任何關聯

## 🔗 相關連結

- [maimai DX 官方網站](https://maimaidx-eng.com/)
- [Chrome Extension 開發文件](https://developer.chrome.com/docs/extensions/)

---

**開發者：** GrayCat  
**最後更新：** 2025-01-27 