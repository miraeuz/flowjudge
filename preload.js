const { contextBridge, ipcRenderer } = require('electron');
const call = ch => arg => ipcRenderer.invoke(ch, arg);
contextBridge.exposeInMainWorld('api', {
  topics: call('topics'), state: call('state'), judge: call('judge'), run: call('run'), mark: call('mark'),
  status: call('act:status'), request: call('act:request'), verify: call('act:verify'),
});
