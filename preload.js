const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // getPcapData: async (filePath) => {
  //   return await ipcRenderer.invoke('getPcapData', filePath);
  // },
  getInterfaceNames: async () => {
    return await ipcRenderer.invoke('getInterfaceNames');
  },
  Operations: async (filePath) => {
    return await ipcRenderer.invoke('Operations', filePath);
  },
  OperationsLiveCapture: async (networkInterfaceIndex) => {
    return await ipcRenderer.invoke('OperationsLiveCapture', networkInterfaceIndex);
  }
});