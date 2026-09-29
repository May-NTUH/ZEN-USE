/**
 * ZEN 操作指南 — 訪客紀錄後端（Google Apps Script）
 * 部署：部署 → 新增部署 → 網頁應用程式；執行身分＝我；存取權＝任何人。
 * 修改本檔後，必須：部署 → 管理部署 → 鉛筆 → 版本選「新版本」→ 部署（網址不變）。
 */
const SPREADSHEET_ID = '1r8eSmJwLQzwzbjblSb1m3h5XN-CY8Xa561Zwf1orbw4'; // 你的試算表 ID
const SHEET_NAME = 'visits';
const HEADERS = ['時間', '工作階段ID', '事件', '頁面', '裝置', '語言', '螢幕', '來源'];

function sheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function clean_(v) {   // 限長並防止試算表公式注入
  v = String(v == null ? '' : v).slice(0, 100);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** 接收網頁送來的紀錄 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    sheet_().appendRow([new Date(), clean_(d.sid), clean_(d.ev), clean_(d.p),
      clean_(d.dev), clean_(d.lang), clean_(d.scr), clean_(d.ref)]);
    CacheService.getScriptCache().remove('count');
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

/** 直接開網址＝檢查是否運作；?action=count＝回傳累計訪客人次（網頁頁尾使用） */
function doGet(e) {
  try {
    if (!e.parameter || e.parameter.action !== 'count') return json_({ ok: true, msg: 'GAS 運作中' });
    const cache = CacheService.getScriptCache();
    const hit = cache.get('count');
    if (hit) return json_({ ok: true, total: Number(hit) });
    const sh = sheet_(), n = sh.getLastRow() - 1;
    let total = 0;
    if (n > 0) sh.getRange(2, 3, n, 1).getValues().forEach(r => { if (r[0] === 'open') total++; });
    cache.put('count', String(total), 60);
    return json_({ ok: true, total: total });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

/** 在編輯器選這個函式按「執行」，可測試是否能寫入試算表 */
function testWrite() {
  sheet_().appendRow([new Date(), 'TEST', 'open', '', 'desktop', 'zh-TW', '0x0', 'test']);
  Logger.log('寫入成功，請到試算表 visits 工作表查看');
}
