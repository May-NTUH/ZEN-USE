/**
 * ZEN 操作指南 — 訪客紀錄後端（Google Apps Script）
 * 用法：在「要存放紀錄的 Google 試算表」開啟 擴充功能 → Apps Script，貼上本檔。
 * 部署為「網頁應用程式」：執行身分＝我；存取權＝任何人。
 * 管理者金鑰：專案設定 → 指令碼屬性 → 新增 ADMIN_KEY = 你自訂的密碼（不要寫進程式碼）。
 */
const SHEET_NAME = 'visits';
const HEADERS = ['時間', '工作階段ID', '事件', '頁面', '裝置', '語言', '螢幕', '來源'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function clean_(v) {           // 限長並防止試算表公式注入
  v = String(v == null ? '' : v).slice(0, 100);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** 接收前端送來的紀錄 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    sheet_().appendRow([new Date(), clean_(d.sid), clean_(d.ev), clean_(d.p),
      clean_(d.dev), clean_(d.lang), clean_(d.scr), clean_(d.ref)]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

/** 管理者統計：?action=stats&key=ADMIN_KEY */
function doGet(e) {
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!key || !e.parameter || e.parameter.action !== 'stats' || e.parameter.key !== key)
    return json_({ ok: false, error: '金鑰錯誤或尚未設定 ADMIN_KEY' });
  const tz = Session.getScriptTimeZone();
  const rows = sheet_().getDataRange().getValues().slice(1);
  const sessions = {}, pages = {}, dayMap = {};
  let total = 0, mobile = 0, desktop = 0;
  rows.forEach(r => {
    sessions[r[1]] = 1;
    if (r[2] === 'open') {
      total++; r[4] === 'mobile' ? mobile++ : desktop++;
      const d = Utilities.formatDate(new Date(r[0]), tz, 'MM/dd');
      (dayMap[d] = dayMap[d] || {})[r[1]] = 1;
    } else if (r[2] === 'view') pages[r[3]] = (pages[r[3]] || 0) + 1;
  });
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = Utilities.formatDate(new Date(Date.now() - i * 864e5), tz, 'MM/dd');
    days.push({ d: d, n: Object.keys(dayMap[d] || {}).length });
  }
  return json_({ ok: true, total: total, sessions: Object.keys(sessions).length, mobile: mobile, desktop: desktop, days: days, pages: pages });
}
