/**
 * ZEN 操作指南 — 後端（Google Apps Script）
 * 功能：訪客紀錄(visits)、搜尋紀錄(searches)、意見回饋(feedback)，皆寫入同一份試算表。
 * 修改本檔後，必須：部署 → 管理部署 → 鉛筆 → 版本選「新版本」→ 部署（網址不變）。
 */
const SPREADSHEET_ID = '1r8eSmJwLQzwzbjblSb1m3h5XN-CY8Xa561Zwf1orbw4'; // 你的試算表 ID
const SHEETS = {
  visits:   { name: 'visits',   head: ['時間', '工作階段ID', '事件', '頁面', '裝置', '語言', '螢幕', '來源'] },
  searches: { name: 'searches', head: ['時間', '工作階段ID', '關鍵字', '結果數', '裝置'] },
  feedback: { name: 'feedback', head: ['時間', '工作階段ID', '類型', '頁面', '內容', '聯絡方式', '裝置'] }
};

function sheet_(key) {
  const def = SHEETS[key], ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(def.name);
  if (!sh) { sh = ss.insertSheet(def.name); sh.appendRow(def.head); sh.setFrozenRows(1); }
  return sh;
}
function clean_(v, max) {   // 限長並防止試算表公式注入
  v = String(v == null ? '' : v).slice(0, max || 100);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** 接收網頁送來的紀錄（依事件類型分流到不同工作表） */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents), now = new Date();
    switch (d.ev) {
      case 'open':
      case 'view':
        sheet_('visits').appendRow([now, clean_(d.sid, 40), clean_(d.ev, 10), clean_(d.p, 20),
          clean_(d.dev, 10), clean_(d.lang, 20), clean_(d.scr, 20), clean_(d.ref, 60)]);
        CacheService.getScriptCache().remove('count');
        break;
      case 'search':
        sheet_('searches').appendRow([now, clean_(d.sid, 40), clean_(d.q, 60), Number(d.n) || 0, clean_(d.dev, 10)]);
        break;
      case 'feedback':
        if (!String(d.msg || '').trim()) return json_({ ok: false, error: 'empty message' });
        sheet_('feedback').appendRow([now, clean_(d.sid, 40), clean_(d.t, 20), clean_(d.p, 20),
          clean_(d.msg, 500), clean_(d.c, 80), clean_(d.dev, 10)]);
        break;
      default:
        return json_({ ok: false, error: 'unknown event' });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

/** 直接開網址＝檢查是否運作；?action=count＝回傳累計訪客人次（網頁頁尾使用） */
function doGet(e) {
  try {
    if (!e.parameter || e.parameter.action !== 'count') return json_({ ok: true, msg: 'GAS 運作中' });
    const cache = CacheService.getScriptCache(), hit = cache.get('count');
    if (hit) return json_({ ok: true, total: Number(hit) });
    const sh = sheet_('visits'), n = sh.getLastRow() - 1;
    let total = 0;
    if (n > 0) sh.getRange(2, 3, n, 1).getValues().forEach(r => { if (r[0] === 'open') total++; });
    cache.put('count', String(total), 60);
    return json_({ ok: true, total: total });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

/** 在編輯器選這個函式按「執行」，會在三個工作表各寫入一筆測試資料（可事後刪除） */
function testWrite() {
  const now = new Date();
  sheet_('visits').appendRow([now, 'TEST', 'open', '', 'desktop', 'zh-TW', '0x0', 'test']);
  sheet_('searches').appendRow([now, 'TEST', '測試關鍵字', 0, 'desktop']);
  sheet_('feedback').appendRow([now, 'TEST', '其他', 'home', '這是一筆測試意見', '', 'desktop']);
  Logger.log('寫入成功：請到試算表查看 visits / searches / feedback 三個工作表');
}
