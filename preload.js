const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // getPcapData: async (filePath) => {
  //   return await ipcRenderer.invoke('getPcapData', filePath);
  // },
  saveFunction: () => {
    ipcRenderer.send('save');
  },
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },

  getInterfaceNames: async () => {
    return await ipcRenderer.invoke('getInterfaceNames');
  },
  Operations: async (filePath) => {
    return await ipcRenderer.invoke('Operations', filePath);
  },
  OperationsLiveCapture: async (networkInterfaceIndex) => {
    return await ipcRenderer.invoke('OperationsLiveCapture', networkInterfaceIndex);
  },
  SavePCAP: async (data, filePath) => {
    return await ipcRenderer.invoke('SavePCAP', data, filePath);
  }
});