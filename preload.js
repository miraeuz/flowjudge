const { contextBridge, ipcRenderer } = require("electron");
const call = (ch) => (arg) => ipcRenderer.invoke(ch, arg);
contextBridge.exposeInMainWorld("api", {
  exportBackup: call("backup:export"),
  importBackup: call("backup:import"),
  exportCsv: call("progress:csv"),
  topics: call("topics"),
  state: call("state"),
  judge: call("judge"),
  status: call("act:status"),
  request: call("act:request"),
  verify: call("act:verify"),
});
