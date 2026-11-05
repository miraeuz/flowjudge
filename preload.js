const { contextBridge, ipcRenderer } = require('electron');
// The web app is the same code as the website; only the one-time Telegram activation needs the desktop shell.
contextBridge.exposeInMainWorld('miraeNative', { activation: { status: () => ipcRenderer.invoke('act:status'), request: name => ipcRenderer.invoke('act:request', name), verify: code => ipcRenderer.invoke('act:verify', code) } });
