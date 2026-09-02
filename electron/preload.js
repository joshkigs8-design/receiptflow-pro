const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isDesktop: true,
  isElectron: true,
  getAppInfo: () => ipcRenderer?.invoke?.("app-info"),
  platform: process.platform,
});

