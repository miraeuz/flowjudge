'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('miraeNative', Object.freeze({
  activation: Object.freeze({
    status: () => ipcRenderer.invoke('act:status'),
    request: name => ipcRenderer.invoke('act:request', name),
    verify: code => ipcRenderer.invoke('act:verify', code),
  }),
  telegram: Object.freeze({
    status: () => ipcRenderer.invoke('telegram:status'),
    save: (token, chatId) => ipcRenderer.invoke('telegram:save', { token, chatId }),
    test: () => ipcRenderer.invoke('telegram:test'),
    clear: () => ipcRenderer.invoke('telegram:clear'),
    notifySolved: payload => ipcRenderer.invoke('telegram:notifySolved', payload),
  }),
}));
