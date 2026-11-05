'use strict';
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const fs = require('fs'), path = require('path'), https = require('https'), crypto = require('crypto'), os = require('os');
const { pathToFileURL } = require('url');
app.setPath('userData', path.join(app.getPath('appData'), 'Flowgorithm Academy'));   // keep existing activation + progress after the rename to Mirae Flow
if (process.platform === 'linux' && process.env.APPIMAGE) app.commandLine.appendSwitch('no-sandbox'); // Ubuntu 23.10+ blocks the Chromium sandbox inside AppImages; the app only loads local files

let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')); } catch {}
const DAY = 864e5, YEAR = 365 * DAY, STATE = () => path.join(app.getPath('userData'), 'state.json');
const readState = () => { try { return JSON.parse(fs.readFileSync(STATE(), 'utf8')); } catch { return {}; } };
const writeState = s => { const f = STATE(), tmp = f + '.tmp'; fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(tmp, JSON.stringify(s)); fs.renameSync(tmp, f); };

// ---- activation (one-time Telegram code) ----
const salt = crypto.randomBytes(16).toString('hex'), hash = c => crypto.createHash('sha256').update(c + salt).digest();
let pending = null, reqLog = [];
function tg(text) {
  return new Promise(res => {
    const body = JSON.stringify({ chat_id: cfg.chatId, text });
    const r = https.request({ hostname: 'api.telegram.org', path: `/bot${cfg.token}/sendMessage`, method: 'POST', timeout: 10000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => { x.resume(); res(x.statusCode === 200); });
    r.on('error', () => res(false)); r.on('timeout', () => { r.destroy(); res(false); }); r.end(body);
  });
}
function status() {
  const s = readState(), now = Date.now(), a = s.activation;
  if (s.lastSeen && now < s.lastSeen - DAY) return { state: 'clock' };       // clock rolled back
  writeState({ ...s, lastSeen: Math.max(now, s.lastSeen || 0) });
  if (!a) return { state: 'none' };
  if (now > a.until) return { state: 'expired', name: a.name };
  return { state: 'ok', name: a.name, daysLeft: Math.ceil((a.until - now) / DAY) };
}
ipcMain.handle('act:status', () => status());
ipcMain.handle('act:request', async (_, name) => {
  name = String(name || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 60);
  if (name.length < 2) return { ok: false, error: 'name' };
  if (!cfg.token || !cfg.chatId) return { ok: false, error: 'not_configured' };
  const now = Date.now(); reqLog = reqLog.filter(t => now - t < 10 * 60e3); if (reqLog.length >= 3) return { ok: false, error: 'rate' };
  reqLog.push(now); const code = String(crypto.randomInt(100000, 1000000));
  pending = { h: hash(code), exp: now + 10 * 60e3, tries: 0, name };
  const ok = await tg(`🔐 Mirae Flow\nIsm: ${name}\nKod: ${code}\nQurilma: ${os.hostname()} (${os.platform()})\nAmal qilish: 10 daqiqa`);
  if (!ok) pending = null; return ok ? { ok: true } : { ok: false, error: 'send_failed' };
});
ipcMain.handle('act:verify', (_, code) => {
  if (!pending) return { ok: false, error: 'expired' };
  if (Date.now() > pending.exp) { pending = null; return { ok: false, error: 'expired' }; }
  if (++pending.tries > 5) { pending = null; return { ok: false, error: 'locked' }; }
  const good = crypto.timingSafeEqual(hash(String(code || '').trim()), pending.h);
  if (!good) return { ok: false, error: pending.tries >= 5 ? 'locked' : 'bad' };
  const s = readState(), now = Date.now(); writeState({ ...s, lastSeen: now, activation: { name: pending.name, at: now, until: now + YEAR } });
  pending = null; return { ok: true };
});


function createWindow() {
  const w = new BrowserWindow({ width: 1360, height: 860, minWidth: 360, minHeight: 560, show: false, autoHideMenuBar: true, backgroundColor: '#0F0A1A', title: 'Mirae Flow',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
  w.webContents.setWindowOpenHandler(() => ({ action: 'deny' })); w.webContents.on('will-navigate', e => e.preventDefault());
  w.once('ready-to-show', () => w.show()); w.loadFile(path.join(__dirname, 'web', 'dist', 'index.html'));   // the same React app as the website, built with TARGET=desktop
}
if (!app.requestSingleInstanceLock()) app.quit();
else app.whenReady().then(() => { Menu.setApplicationMenu(null); createWindow(); app.on('activate', () => BrowserWindow.getAllWindows().length || createWindow()); });
app.on('window-all-closed', () => process.platform === 'darwin' || app.quit());
