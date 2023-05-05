const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getPcapData: async (filePath) => {
    return await ipcRenderer.invoke('getPcapData', filePath);
  }
});