// Test-only renderer host. No activation bypass is included in the packaged application.
const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1440,
    height: 1000,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  w.loadFile(require("path").join(__dirname, "../renderer/index.html"));
});
