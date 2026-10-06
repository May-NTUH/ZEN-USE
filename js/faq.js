/* 常見問題：要新增或修改，只需編輯此檔。格式：[症狀, 可能原因, 解決方式, 對應章節id] */
window.ZEN_SECTIONS.push({id:"faq",ic:"❓",g:"常見問題",t:"常見問題與意見回饋",d:"遇到狀況先看這裡，找不到答案可留言",im:[],st:[],nt:[],fb:true,faq:[
["轉出的圖，比例尺位置亂跳或大小改變","比例尺沒有勾選「Zoom with Image」，轉出時位置與大小會隨顯示比例改變。","在比例尺上按右鍵 → <b>Format Graphical Elements</b>，勾選 <b>Zoom with Image</b>，再重新轉檔。","q2"],
["看不到完整的設定參數","沒有勾選 Show All 時，只會顯示部分參數。","勾選 Parameters 欄位右上角的 <b>Show All</b>。","c1"],
["拆出來的檔案名稱沒有位點名稱，只有順序","Method 選錯：選到了 Split Scenes，而不是 Split Scenes (Write files)。","在 Method 選擇 <b>Split Scenes (Write files)</b>，並確認參數中已勾選 <b>Include Scene Information in Generated File Name</b>，再重新拆解。","q5"],
["匯出的圖不是我調整後的樣子（沒有套色、亮度對比或比例尺）","匯出時沒有套用顯示設定與標示，或匯出的是原始資料。","在 Image Export 參數中勾選 <b>Apply display curve and channel color</b>，並勾選 <b>Burn in graphics</b>（讓比例尺等標示一併輸出）。<b>Original data</b> 只會匯出原始單色影像。","p1"],
["批次影像轉檔時，其他檔案的參數沒有跟著設定","批次模式下，每個檔案都要各自套用參數。","先設定好其中一個檔案，確認點選它後按 <b>Copy Parameters</b>，再選取其他所有檔案按 <b>Paste Parameters</b>。","c2"],
["找不到轉檔後的檔案存在哪裡","轉檔前沒有確認輸出位置。","單次影像轉檔請看參數裡的 <b>Export To</b>；批次影像轉檔請檢查 <b>Use Input Folder as Output Folder</b>：勾選＝存回原始資料夾，取消勾選並點 … 可統一指定路徑。","c2"],
["只想匯出部分螢光或部分範圍","預設會匯出全部影像。","在參數中選擇 <b>Define subset</b>，再選擇要匯出的 Channels、Region（Image Export 另有 Tiles；Movie Export 另有 Time）。","p1"],
["轉出的影片播放太快或太慢","影片速度由 Movie Export 的 Mapping 設定決定。","在 Movie Export 參數的 Mapping 設定播放速度（張數/秒）。","p3"]
]});
