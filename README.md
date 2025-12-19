# 12-Week Year App (Silent Perihelion)
這是一個強大的桌面應用程式，旨在幫助您實踐「12 週計畫 (12-Week Year)」執行系統，採用現代網頁技術與 Electron 構建。

## 🚀 功能特色
- **儀表板 (Dashboard)**：視覺化呈現您當前週期的進度與表現。
- **目標與策略 (Goals & Strategy)**：核心規劃中心。定義您的高層次目標，並將其拆解為 12 週的專案。
- **每週計畫 (Weekly Plan)**：專注於每週戰術與執行的檢視畫面。
- **文件 (Documents)**：整合編輯器 (Tiptap)，用於撰寫筆記或文件。
- **封存 (Archive)**：存取過往 12 週週期的歷史記錄。
- **設定 (Settings)**：管理應用程式設定，包括資料庫位置、語言偏好等。

## 🛠 技術堆疊
本專案採用穩健的現代技術堆疊構建：
- **Runtime**: [Electron](https://www.electronjs.org/) (桌面整合)
- **前端框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **建置工具**: [Vite](https://vitejs.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **樣式**: [TailwindCSS](https://tailwindcss.com/)
- **狀態管理**: [Pinia](https://pinia.vuejs.org/)
- **資料庫**: SQLite (透過 `better-sqlite3`)
- **文件編輯器**: [Tiptap](https://tiptap.dev/)
- **圖示**: [Phosphor Icons](https://phosphoricons.com/)

## 📖 使用指南
### 如何開始一個新計畫 (Project)
若要開始一個新的 12 週目標或專案：
1. 導航至側邊欄的 **Goals & Strategy (目標與策略)** 分頁。
2. 點擊右上角的 **+ New Project (新增專案)** 按鈕。
3. 在建立視窗中：
  - **標題 (Title)**：輸入清晰、可執行的專案名稱。
  - **圖示 (Icon)**：點擊圖示以開啟選擇器，選擇一個視覺識別圖示。
  - **描述 (Description)**：簡要描述此專案的成果或目的。
  - **顏色 (Color)**：選擇一個顏色標籤以便分類。
4. 點擊 **Create (建立)** 以初始化專案。
5. 從列表中選擇您的新專案，開始為 12 週的每一週新增 **戰術 (Tactics)**。

### 如何開始一個新週期 (Cycle)
當目前的 12 週結束，或您想重新開始時：
1. 點擊左下角的 **Settings (設定)** 圖示。
2. 在 **Cycle Management** 區塊中，點擊 **Start New Cycle** 按鈕。
3. 輸入新週期的名稱（如 `2025 Q2`）與 **開始日期**。
4. 確認後，舊週期將被封存，系統會根據新日期重新計算週次（若日期在未來，將顯示為 Week 0）。

## 💻 開發設定

```bash
# 安裝依賴
npm install

# 啟動開發模式
npm run dev

# 建置生產版本
npm run build
```

## 資訊安全與隱私 (Security & Privacy)
本應用程式採用 **Local-First (本機優先)** 架構，高度重視您的資料隱私與安全：
- **資料儲存於本機**：所有計畫、專案與筆記資料皆儲存於您電腦本機的 SQLite 資料庫 (`12week.db`) 中。
- **無雲端上傳**：我們不會將您的資料上傳至任何雲端伺服器或第三方服務。您完全擁有並掌控您的資料。
- **資料備份**：您可以隨時透過備份資料庫檔案（位於 AppData/UserData 目錄下）來確保資料安全。
- **開源透明**：本專案程式碼完全開源，您可以隨時檢視原始碼以確保沒有隱藏的網路請求或後門。

## ℹ️ 版本資訊 (Version Info)
當前版本: **v0.1.3**
完整變更紀錄請參閱 [CHANGELOG.md](./CHANGELOG.md)。


