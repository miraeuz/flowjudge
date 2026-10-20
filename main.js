"use strict";
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs"),
  path = require("path"),
  https = require("https"),
  crypto = require("crypto"),
  os = require("os");
const { isolatedJudge } = require("./engine/isolated.cjs");
let judging = false;

let cfg = {};
try {
  cfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "config.json"), "utf8"),
  );
} catch {}
const DAY = 864e5,
  YEAR = 365 * DAY,
  STATE = () => path.join(app.getPath("userData"), "state.json");
const readState = () => {
  try {
    return JSON.parse(fs.readFileSync(STATE(), "utf8"));
  } catch {
    return {};
  }
};
const writeState = (s) => {
  const f = STATE(),
    tmp = f + ".tmp";
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(s));
  fs.renameSync(tmp, f);
};

// ---- content (hidden tests never leave the main process) ----
let topics = [];
const loadTopics = () => {
  const d = path.join(__dirname, "content", "topics");
  topics = fs
    .readdirSync(d)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(d, f), "utf8")))
    .sort((a, b) => a.order - b.order);
};
const pub = (p) => ({
  id: p.id,
  title: p.title,
  statement: p.statement,
  inputFormat: p.inputFormat,
  outputFormat: p.outputFormat,
  difficulty: p.difficulty || "easy",
  hints: p.hints || [],
  requiredBlocks: p.judge?.requiredBlocks || [],
  examples: p.tests
    .filter((t) => !t.hidden)
    .slice(0, 2)
    .map((t) => ({ in: t.in, out: t.out })),
});
const publicTopics = () =>
  topics.map((t) => ({
    id: t.id,
    order: t.order,
    title: t.title,
    lesson: t.lesson,
    concepts: t.concepts || [],
    classwork: t.classwork.map(pub),
    homework: t.homework.map(pub),
  }));

// ---- activation (one-time Telegram code) ----
const salt = crypto.randomBytes(16).toString("hex"),
  hash = (c) =>
    crypto
      .createHash("sha256")
      .update(c + salt)
      .digest();
let pending = null,
  sendingCode = false;
function tg(text) {
  return new Promise((res) => {
    const body = JSON.stringify({ chat_id: cfg.chatId, text });
    const r = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${cfg.token}/sendMessage`,
        method: "POST",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (x) => {
        x.resume();
        res(x.statusCode === 200);
      },
    );
    r.on("error", () => res(false));
    r.on("timeout", () => {
      r.destroy();
      res(false);
    });
    r.end(body);
  });
}
function status() {
  const s = readState(),
    now = Date.now(),
    a = s.activation;
  if (s.lastSeen && now < s.lastSeen - DAY) return { state: "clock" }; // clock rolled back
  writeState({ ...s, lastSeen: Math.max(now, s.lastSeen || 0) });
  if (!a) return { state: "none" };
  if (now > a.until) return { state: "expired", name: a.name };
  return {
    state: "ok",
    name: a.name,
    daysLeft: Math.ceil((a.until - now) / DAY),
  };
}
ipcMain.handle("act:status", () => status());
ipcMain.handle("act:request", async (_, name) => {
  name = String(name || "")
    .replace(/[\u0000-\u001f]/g, "")
    .trim()
    .slice(0, 60);
  if (name.length < 2) return { ok: false, error: "name" };
  if (!cfg.token || !cfg.chatId) return { ok: false, error: "not_configured" };
  if (sendingCode) return { ok: false, error: "rate" };
  const now = Date.now(),
    saved = readState(),
    reqLog = (saved.activationRequests || []).filter(
      (t) => now - t < 10 * 60e3,
    );
  if (reqLog.length >= 3) return { ok: false, error: "rate" };
  reqLog.push(now);
  writeState({ ...saved, activationRequests: reqLog });
  sendingCode = true;
  const code = String(crypto.randomInt(100000, 1000000));
  pending = { h: hash(code), exp: now + 10 * 60e3, tries: 0, name };
  const ok = await tg(
    `🔐 Flowgorithm Academy\nIsm: ${name}\nKod: ${code}\nQurilma: ${os.hostname()} (${os.platform()})\nAmal qilish: 10 daqiqa`,
  );
  sendingCode = false;
  if (!ok) pending = null;
  return ok ? { ok: true } : { ok: false, error: "send_failed" };
});
ipcMain.handle("act:verify", (_, code) => {
  if (!pending) return { ok: false, error: "expired" };
  if (Date.now() > pending.exp) {
    pending = null;
    return { ok: false, error: "expired" };
  }
  if (++pending.tries > 5) {
    pending = null;
    return { ok: false, error: "locked" };
  }
  const good = crypto.timingSafeEqual(
    hash(String(code || "").trim()),
    pending.h,
  );
  if (!good) {
    const locked = pending.tries >= 5;
    if (locked) pending = null;
    return { ok: false, error: locked ? "locked" : "bad" };
  }
  const s = readState(),
    now = Date.now();
  writeState({
    ...s,
    lastSeen: now,
    activation: { name: pending.name, at: now, until: now + YEAR },
  });
  pending = null;
  return { ok: true };
});

// ---- data + judge ----
ipcMain.handle("topics", () => publicTopics());
ipcMain.handle("state", () => ({
  progress: readState().progress || {},
  attempts: readState().attempts || [],
}));
ipcMain.handle("judge", async (_, a) => {
  if (status().state !== "ok") return { error: "Not activated" };
  const t = topics.find((x) => x.id === a?.topic),
    p = t && [...t.classwork, ...t.homework].find((x) => x.id === a.problem);
  if (!p || typeof a.file !== "string") return { error: "Bad request" };
  if (Buffer.byteLength(a.file, "utf8") > 1e6)
    return { error: "File exceeds 1 MB" };
  if (judging) return { error: "Another submission is running" };
  judging = true;
  try {
    const r = await isolatedJudge(a.file, p.tests, p.judge || {});
    const s = readState(),
      key = `${t.id}/${p.id}`,
      now = Date.now();
    if (r.verdict === "AC")
      s.progress = { ...(s.progress || {}), [key]: s.progress?.[key] || now };
    s.attempts = [
      ...(s.attempts || []),
      { key, at: now, verdict: r.verdict, passed: r.passed, total: r.total },
    ].slice(-1000);
    writeState(s);
    return r;
  } finally {
    judging = false;
  }
});

// Backups intentionally contain learning progress only, never activation or credentials.
ipcMain.handle("backup:export", async () => {
  if (status().state !== "ok") return { error: "Not activated" };
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: "Flowgorithm-progress.json",
    filters: [{ name: "Progress backup", extensions: ["json"] }],
  });
  if (canceled) return { canceled: true };
  const s = readState();
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          format: "flowgorithm-progress",
          version: 1,
          progress: s.progress || {},
          attempts: s.attempts || [],
        },
        null,
        2,
      ),
    );
    return { ok: true };
  } catch {
    return { error: "Could not save backup" };
  }
});
ipcMain.handle("backup:import", async () => {
  if (status().state !== "ok") return { error: "Not activated" };
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Progress backup", extensions: ["json"] }],
  });
  if (canceled) return { canceled: true };
  try {
    if (fs.statSync(filePaths[0]).size > 2e6) throw Error();
    const data = JSON.parse(fs.readFileSync(filePaths[0], "utf8"));
    if (
      data.format !== "flowgorithm-progress" ||
      data.version !== 1 ||
      !data.progress ||
      typeof data.progress !== "object" ||
      Array.isArray(data.progress)
    )
      throw Error();
    const valid = new Set(
      topics.flatMap((t) =>
        [...t.classwork, ...t.homework].map((p) => `${t.id}/${p.id}`),
      ),
    );
    const progress = {};
    for (const [key, value] of Object.entries(data.progress)) {
      if (
        !valid.has(key) ||
        !Number.isSafeInteger(value) ||
        value < 1 ||
        value > Date.now() + 864e5
      )
        throw Error();
      progress[key] = value;
    }
    const s = readState();
    for (const [key, value] of Object.entries(s.progress || {}))
      progress[key] = Math.min(value, progress[key] || value);
    writeState({ ...s, progress });
    return { ok: true };
  } catch {
    return { error: "Invalid or unreadable progress backup" };
  }
});
ipcMain.handle("progress:csv", async () => {
  if (status().state !== "ok") return { error: "Not activated" };
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: "Flowgorithm-results.csv",
    filters: [{ name: "CSV", extensions: ["csv"] }],
  });
  if (canceled) return { canceled: true };
  const s = readState();
  const cell = (value) =>
    '"' +
    String(value)
      .replace(/^[=+@-]/, "'$&")
      .replace(/"/g, '""') +
    '"';
  const rows = [["Student", "Topic", "Problem", "Solved", "Solved at"]];
  for (const t of topics)
    for (const p of [...t.classwork, ...t.homework]) {
      const at = s.progress?.[`${t.id}/${p.id}`];
      rows.push([
        s.activation?.name || "",
        t.title.uz,
        p.title.uz,
        at ? "Yes" : "No",
        at ? new Date(at).toISOString() : "",
      ]);
    }
  try {
    fs.writeFileSync(
      filePath,
      "\ufeff" + rows.map((row) => row.map(cell).join(",")).join("\r\n"),
    );
    return { ok: true };
  } catch {
    return { error: "Could not export results" };
  }
});

function createWindow() {
  const w = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 420,
    minHeight: 560,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#0d1020",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  w.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  w.webContents.on("will-navigate", (e) => e.preventDefault());
  w.once("ready-to-show", () => w.show());
  w.loadFile(path.join(__dirname, "renderer", "index.html"));
}
if (!app.requestSingleInstanceLock()) app.quit();
else
  app.whenReady().then(() => {
    loadTopics();
    createWindow();
    app.on(
      "activate",
      () => BrowserWindow.getAllWindows().length || createWindow(),
    );
  });
app.on("window-all-closed", () => process.platform === "darwin" || app.quit());
