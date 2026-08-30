const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  getAppInfo: () => ipcRenderer.invoke("app-info"),
  printPage: (options) => ipcRenderer.invoke("print-page", options),
  platform: process.platform,
});

