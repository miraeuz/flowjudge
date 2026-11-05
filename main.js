'use strict';
const { app, BrowserWindow, ipcMain, Menu, safeStorage, shell } = require('electron');
const fs = require('fs'), path = require('path'), https = require('https'), crypto = require('crypto');
const { validateTelegramConfig, buildSolvedMessage, cleanText } = require('./telegram-utils.cjs');

// Keep the existing user-data directory so upgrades preserve student progress and activation.
app.setPath('userData', path.join(app.getPath('appData'), 'Flowgorithm Academy'));
if (process.platform === 'linux' && process.env.APPIMAGE) app.commandLine.appendSwitch('no-sandbox');

const DAY = 864e5, YEAR = 365 * DAY;
const STATE = () => path.join(app.getPath('userData'), 'state.json');
const TELEGRAM_FILE = () => path.join(app.getPath('userData'), 'telegram.sec');
const readState = () => { try { const value = JSON.parse(fs.readFileSync(STATE(), 'utf8')); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
const writeState = state => {
  const file = STATE(), temp = file + '.tmp';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(temp, JSON.stringify(state), { mode: 0o600 });
  fs.renameSync(temp, file);
};

// Telegram credentials are never placed in config.json, the app bundle, renderer storage or logs.
// Electron safeStorage uses DPAPI on Windows and the OS keychain/keyring on supported desktops.
// Refuse Linux's basic_text fallback: it does not protect the stored key with a system keyring.
function hasSecureTelegramStorage() {
  try {
    if (!safeStorage.isEncryptionAvailable()) return false;
    if (typeof safeStorage.getSelectedStorageBackend === 'function') {
      return ['dpapi', 'keychain', 'gnome_libsecret', 'kwallet5', 'kwallet6'].includes(safeStorage.getSelectedStorageBackend());
    }
    return process.platform === 'win32' || process.platform === 'darwin';
  } catch { return false; }
}

function readTelegramConfig() {
  try {
    if (!hasSecureTelegramStorage() || !fs.existsSync(TELEGRAM_FILE())) return null;
    const decrypted = safeStorage.decryptString(fs.readFileSync(TELEGRAM_FILE()));
    const value = JSON.parse(decrypted);
    const validated = validateTelegramConfig(value.token, value.chatId);
    return validated.ok ? { token: validated.token, chatId: validated.chatId } : null;
  } catch { return null; }
}

function saveTelegramConfig(token, chatId) {
  const existing = readTelegramConfig();
  const validated = validateTelegramConfig(String(token ?? '').trim() || existing?.token, chatId);
  if (!validated.ok) return validated;
  if (!hasSecureTelegramStorage()) return { ok: false, error: 'secure_storage_unavailable' };
  try {
    const file = TELEGRAM_FILE(), temp = file + '.tmp';
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const encrypted = safeStorage.encryptString(JSON.stringify({ token: validated.token, chatId: validated.chatId }));
    fs.writeFileSync(temp, encrypted, { mode: 0o600 });
    fs.renameSync(temp, file);
    if (!existing || existing.chatId !== validated.chatId) {
      const state = readState();
      writeState({ ...state, telegramPending: [] });
    }
    return { ok: true };
  } catch { return { ok: false, error: 'secure_storage_failed' }; }
}

function sendTelegram(text, config = readTelegramConfig()) {
  if (!config?.token || !config?.chatId) return Promise.resolve(false);
  const body = JSON.stringify({ chat_id: config.chatId, text });
  return new Promise(resolve => {
    const request = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${config.token}/sendMessage`,
      method: 'POST',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, response => {
      let data = '';
      response.on('data', chunk => { if (data.length < 32_000) data += chunk.toString('utf8'); });
      response.on('end', () => {
        try { resolve(response.statusCode === 200 && JSON.parse(data).ok === true); }
        catch { resolve(false); }
      });
    });
    request.on('error', () => resolve(false));
    request.on('timeout', () => { request.destroy(); resolve(false); });
    request.end(body);
  });
}

const salt = crypto.randomBytes(16);
const codeHash = code => crypto.createHash('sha256').update(salt).update(String(code)).digest();
let pendingActivation = null;
let requestLog = [];

function activationStatus() {
  const state = readState(), now = Date.now(), activation = state.activation;
  if (state.lastSeen && now < state.lastSeen - DAY) return { state: 'clock' };
  writeState({ ...state, lastSeen: Math.max(now, state.lastSeen || 0) });
  if (!activation) return { state: 'none' };
  if (now > activation.until) return { state: 'expired', name: activation.name };
  return { state: 'ok', name: activation.name, daysLeft: Math.ceil((activation.until - now) / DAY) };
}

ipcMain.handle('act:status', () => activationStatus());
ipcMain.handle('act:request', async (_, rawName) => {
  const name = cleanText(rawName, 60);
  if (name.length < 2) return { ok: false, error: 'name' };
  const config = readTelegramConfig();
  if (!config) return { ok: false, error: 'not_configured' };
  const now = Date.now();
  requestLog = requestLog.filter(time => now - time < 10 * 60e3);
  if (requestLog.length >= 3) return { ok: false, error: 'rate' };
  requestLog.push(now);
  const code = String(crypto.randomInt(100000, 1000000));
  pendingActivation = { hash: codeHash(code), expiresAt: now + 10 * 60e3, tries: 0, name };
  const sent = await sendTelegram(`🔐 Mirae Flow faollashtirish kodi\nIsm: ${name}\nKod: ${code}\nAmal qilish muddati: 10 daqiqa`, config);
  if (!sent) pendingActivation = null;
  return sent ? { ok: true } : { ok: false, error: 'send_failed' };
});

ipcMain.handle('act:verify', (_, rawCode) => {
  if (!pendingActivation) return { ok: false, error: 'expired' };
  if (Date.now() > pendingActivation.expiresAt) { pendingActivation = null; return { ok: false, error: 'expired' }; }
  if (++pendingActivation.tries > 5) { pendingActivation = null; return { ok: false, error: 'locked' }; }
  const code = String(rawCode ?? '').trim();
  const good = /^\d{6}$/.test(code) && crypto.timingSafeEqual(codeHash(code), pendingActivation.hash);
  if (!good) return { ok: false, error: pendingActivation.tries >= 5 ? 'locked' : 'bad' };
  const state = readState(), now = Date.now();
  writeState({ ...state, lastSeen: now, activation: { name: pendingActivation.name, at: now, until: now + YEAR } });
  pendingActivation = null;
  return { ok: true };
});

ipcMain.handle('telegram:status', () => {
  const config = readTelegramConfig();
  return { configured: Boolean(config), chatId: config?.chatId ?? '', secureStorageAvailable: hasSecureTelegramStorage() };
});
ipcMain.handle('telegram:save', (_, input) => saveTelegramConfig(input?.token, input?.chatId));
ipcMain.handle('telegram:clear', () => {
  try {
    for (const file of [TELEGRAM_FILE(), TELEGRAM_FILE() + '.tmp']) if (fs.existsSync(file)) fs.unlinkSync(file);
    const state = readState();
    writeState({ ...state, telegramPending: [] });
    return { ok: true };
  }
  catch { return { ok: false, error: 'clear_failed' }; }
});
let telegramTestTimes = [];
ipcMain.handle('telegram:test', async () => {
  const now = Date.now();
  telegramTestTimes = telegramTestTimes.filter(time => now - time < 10 * 60e3);
  if (telegramTestTimes.length >= 5 || (telegramTestTimes.length && now - telegramTestTimes[telegramTestTimes.length - 1] < 5000)) return { ok: false, error: 'rate' };
  telegramTestTimes.push(now);
  const config = readTelegramConfig();
  if (!config) return { ok: false, error: 'not_configured' };
  const sent = await sendTelegram('✅ Mirae Flow: Telegram bildirishnomalari muvaffaqiyatli ulandi.', config);
  return sent ? { ok: true } : { ok: false, error: 'send_failed' };
});

let telegramFlushBusy = false;
let telegramStateLock = Promise.resolve();
function withTelegramStateLock(task) {
  const run = telegramStateLock.then(task, task);
  telegramStateLock = run.then(() => undefined, () => undefined);
  return run;
}

async function flushTelegramQueue() {
  if (telegramFlushBusy) return;
  telegramFlushBusy = true;
  try {
    await withTelegramStateLock(async () => {
      const config = readTelegramConfig();
      if (!config) return;
      const state = readState();
      const queue = Array.isArray(state.telegramPending) ? state.telegramPending.slice(0, 30) : [];
      if (!queue.length) return;
      const sent = new Set(Array.isArray(state.telegramSent) ? state.telegramSent : []);
      const remaining = [];
      const now = Date.now();
      for (const item of queue) {
        if (!item?.key || sent.has(item.key)) continue;
        if (!Number.isFinite(item.createdAt) || now - item.createdAt > 7 * DAY || !Number.isSafeInteger(item.attempts) || item.attempts < 0 || item.attempts >= 10) continue;
        let text;
        try {
          const expectedKey = `${cleanText(item.payload?.profileId, 80)}:${cleanText(item.payload?.problemId, 30)}`;
          if (expectedKey !== item.key) continue;
          text = buildSolvedMessage(item.payload, new Date(item.createdAt));
        } catch { continue; }
        if (await sendTelegram(text, config)) sent.add(item.key);
        else remaining.push({ key: item.key, payload: item.payload, attempts: item.attempts + 1, createdAt: item.createdAt });
      }
      // Re-read state after network calls so activation writes made while a send was in flight are preserved.
      const latest = readState();
      writeState({ ...latest, telegramSent: [...sent].slice(-5000), telegramPending: remaining.slice(-30) });
    });
  } finally { telegramFlushBusy = false; }
}

ipcMain.handle('telegram:notifySolved', async (_, payload) => withTelegramStateLock(async () => {
  const config = readTelegramConfig();
  if (!config) return { status: 'not_configured' };
  let payloadSize = 0;
  try { payloadSize = JSON.stringify(payload).length; } catch { return { status: 'invalid' }; }
  if (!payload || typeof payload !== 'object' || payloadSize > 4000) return { status: 'invalid' };
  const safePayload = {
    profileId: cleanText(payload.profileId, 80),
    firstName: cleanText(payload.firstName, 50),
    lastName: cleanText(payload.lastName, 50),
    displayName: cleanText(payload.displayName, 100),
    groupName: cleanText(payload.groupName, 50),
    problemId: cleanText(payload.problemId, 30),
    problemTitle: cleanText(payload.problemTitle, 120),
  };
  if (!safePayload.profileId || !/^[A-Z0-9-]{3,30}$/i.test(safePayload.problemId)) return { status: 'invalid' };
  const key = `${safePayload.profileId}:${safePayload.problemId}`;
  const state = readState();
  const sent = new Set(Array.isArray(state.telegramSent) ? state.telegramSent : []);
  if (sent.has(key)) return { status: 'already_sent' };
  const queue = Array.isArray(state.telegramPending) ? state.telegramPending.slice(0, 30) : [];
  if (queue.some(item => item?.key === key)) return { status: 'queued' };
  let message;
  try { message = buildSolvedMessage(safePayload); }
  catch { return { status: 'invalid' }; }
  if (await sendTelegram(message, config)) {
    const latest = readState();
    const latestSent = new Set(Array.isArray(latest.telegramSent) ? latest.telegramSent : []);
    latestSent.add(key);
    writeState({ ...latest, telegramSent: [...latestSent].slice(-5000), telegramPending: (Array.isArray(latest.telegramPending) ? latest.telegramPending : []).filter(item => item?.key !== key) });
    return { status: 'sent' };
  }
  // Queue a structured payload, never arbitrary message text read back from the editable state file.
  const latest = readState();
  const latestQueue = Array.isArray(latest.telegramPending) ? latest.telegramPending : [];
  writeState({ ...latest, telegramPending: [...latestQueue.filter(item => item?.key !== key), { key, payload: safePayload, attempts: 0, createdAt: Date.now() }].slice(-30) });
  return { status: 'queued' };
}));

function createWindow() {
  const window = new BrowserWindow({
    width: 1360, height: 860, minWidth: 360, minHeight: 560, show: false,
    autoHideMenuBar: true, backgroundColor: '#0F0A1A', title: 'Mirae Flow',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, devTools: !app.isPackaged },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url);
      if (target.protocol === 'https:' && target.hostname === 'www.flowgorithm.org') void shell.openExternal(target.href);
    } catch {}
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.once('ready-to-show', () => window.show());
  window.loadFile(path.join(__dirname, 'web', 'dist', 'index.html'));
}

if (!app.requestSingleInstanceLock()) app.quit();
else app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  void flushTelegramQueue();
  const telegramRetryTimer = setInterval(() => { void flushTelegramQueue(); }, 60_000);
  telegramRetryTimer.unref?.();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
