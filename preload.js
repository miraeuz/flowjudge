const { contextBridge, ipcRenderer } = require('electron');
const call = ch => arg => ipcRenderer.invoke(ch, arg);
contextBridge.exposeInMainWorld('api', {
  topics: call('topics'), state: call('state'), judge: call('judge'),
  status: call('act:status'), request: call('act:request'), verify: call('act:verify'),
});
