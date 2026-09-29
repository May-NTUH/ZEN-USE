# ZEN 3.4 影像處理與轉檔操作指南

純靜態網頁（HTML / CSS / JS），可直接用 **GitHub Pages** 發布；訪客紀錄寫入 **Google Sheet**（Apps Script）。

```
├─ index.html          首頁
├─ css/style.css       樣式（暖色系）
├─ js/config.js        ★ 設定 GAS_URL
├─ js/content.js       ★ 說明內容（改文字改這裡）
├─ js/app.js           主程式
├─ images/             投影片截圖 slide-XX.jpg
└─ apps-script/Code.gs Google Apps Script 後端
```

## 一、上傳 GitHub 並發布
1. GitHub 建立新 repository（例如 `zen-guide`）。
2. 上傳本資料夾全部內容（網頁「Add file → Upload files」，或 `git init && git add . && git commit -m "init" && git remote add origin <網址> && git push -u origin main`）。
3. **Settings → Pages → Branch: main / (root) → Save**。
4. 數分鐘後網址為 `https://<帳號>.github.io/zen-guide/`。

## 二、串接 Google Sheet 記錄訪客
1. 建立新的 Google 試算表。
2. **擴充功能 → Apps Script**，把 `apps-script/Code.gs` 全部貼上並儲存。
3. **專案設定（齒輪）→ 指令碼屬性 → 新增**：`ADMIN_KEY` = 自訂密碼。
4. **部署 → 新增部署 → 類型：網頁應用程式**：執行身分「我」、誰可以存取「任何人」→ 部署並授權（會出現「未驗證」提示，選進階 → 前往）。
5. 複製「網頁應用程式網址」（結尾 `/exec`），貼到 `js/config.js` 的 `GAS_URL`，重新上傳到 GitHub。
6. 開啟網站，試算表會自動出現 `visits` 工作表並新增紀錄。

## 三、查看統計
- **試算表**：`visits` 工作表可直接篩選、做樞紐分析。
- **網頁**：網址後加 `#admin`（例 `.../zen-guide/#admin`），輸入 ADMIN_KEY，顯示累計瀏覽、不重複訪客、近 14 日趨勢、章節排行、裝置比例。

## 記錄欄位與注意事項
時間、工作階段 ID、事件（open＝進站、view＝看章節）、頁面、裝置、語言、螢幕、來源網域。
- 「不重複訪客」以瀏覽器工作階段計算，無法辨識個人，也不含 IP（Apps Script 取不到）。
- 每個分頁工作階段只記一次進站；使用廣告攔截器的訪客可能不會被計入。
- 任何人知道 GAS 網址都能寫入假資料；ADMIN_KEY 只保護「讀取統計」。內部使用足夠，若要更嚴謹請加驗證。
- 修改 `Code.gs` 後需「部署 → 管理部署 → 編輯 → 新版本」才會生效。
- Apps Script 有每日執行配額，一般 SOP 流量綽綽有餘。
