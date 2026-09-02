// Set environment flag to silence non-critical development warnings in Electron
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

const { app, BrowserWindow, shell, ipcMain, Menu, dialog, session } = require("electron");
const path = require("path");

let mainWindow = null;
const isDev = process.env.NODE_ENV === "development";
const openDevTools = process.env.ELECTRON_DEVTOOLS === "true" || process.env.ELECTRON_DEVTOOLS === "1";

function getIconPath() {
  if (process.platform === "win32") {
    return path.join(__dirname, "../public/favicon.ico");
  }
  return path.join(__dirname, "../public/favicon.png");
}

function createMainWindow() {
  const iconPath = getIconPath();

  // Set CSP headers for security and clean renderer behavior
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data: blob:;"
        ],
      },
    });
  });

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: iconPath,
    backgroundColor: "#063B2A",
    title: "RentReceipt Pro — Smart Rental Management",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
    show: false, // Wait until ready-to-show to prevent visual flash
  });

  // Gracefully show when rendered
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  // Intercept new window requests and open externally in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("mailto:") || url.startsWith("tel:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Intercept in-page external navigations (e.g. WhatsApp, Safaricom Daraja, External Links)
  mainWindow.webContents.on("will-navigate", (event, url) => {
    const isLocalhost = url.startsWith("http://localhost:") || url.startsWith("http://127.0.0.1:");
    const isAppDomain = url.includes("rentreceipt.co.ke");

    if (!isLocalhost && !isAppDomain && (url.startsWith("http:") || url.startsWith("https:"))) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Graceful offline recovery handler
  mainWindow.webContents.on("did-fail-load", (event, errorCode) => {
    if (errorCode === -3) return; // Ignore aborted requests
    const offlineHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>RentReceipt Pro</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #063B2A; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .card { background: #0b1220; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); max-width: 440px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          h1 { font-size: 22px; margin-bottom: 12px; color: #10b981; }
          p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
          button { background: #10b981; color: #fff; border: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
          button:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>RentReceipt Pro</h1>
          <p>Connecting to RentReceipt Pro server. Please check your internet connection and try again.</p>
          <button onclick="window.location.reload()">Retry Connection</button>
        </div>
      </body>
      </html>
    `;
    mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(offlineHtml));
  });

  // Build native application menu
  setupAppMenu();

  // Load URL depending on environment
  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else if (isDev) {
    mainWindow.loadURL("http://localhost:3000").catch(() => {
      mainWindow.loadURL("http://localhost:5173").catch(() => {
        mainWindow.loadURL("https://www.rentreceipt.co.ke");
      });
    });
  } else {
    // In production, connect to the live RentReceipt Pro cloud application
    mainWindow.loadURL("https://www.rentreceipt.co.ke");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function setupAppMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Print Active Receipt / Page",
          accelerator: "CmdOrCtrl+P",
          click: () => {
            if (mainWindow) mainWindow.webContents.print({ silent: false });
          },
        },
        { type: "separator" },
        {
          label: "Reload Window",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.session.clearCache().then(() => {
                mainWindow.reload();
              });
            }
          },
        },
        {
          label: "Clear Cache & Hard Refresh",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.session.clearCache().then(() => {
                mainWindow.webContents.reloadIgnoringCache();
              });
            }
          },
        },
        { type: "separator" },
        {
          label: "Exit RentReceipt Pro",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Alt+F4",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(process.platform === "darwin" ? [{ type: "separator" }, { role: "front" }] : [{ role: "close" }]),
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Download Landlord Operations Manual (PDF)",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript("window.downloadLandlordManualPdf ? window.downloadLandlordManualPdf() : console.log('Downloading...');");
            }
          },
        },
        { type: "separator" },
        {
          label: "Visit Official Website",
          click: () => shell.openExternal("https://www.rentreceipt.co.ke"),
        },
        {
          label: "Technical Support on WhatsApp",
          click: () => shell.openExternal("https://wa.me/254742868209"),
        },
        { type: "separator" },
        {
          label: "About RentReceipt Pro",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About RentReceipt Pro",
              message: "RentReceipt Pro Desktop Application",
              detail: `Version: ${app.getVersion()}\nSmart Property Management & Digital M-Pesa Receipts for Kenyan Real Estate.\n(c) 2026 Codevanta Ventures.`,
              buttons: ["OK"],
              icon: getIconPath(),
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Register IPC handlers
ipcMain.handle("app-info", () => ({
  version: app.getVersion(),
  platform: process.platform,
  isElectron: true,
}));

ipcMain.handle("print-page", async (event, options = {}) => {
  if (!mainWindow) return false;
  return new Promise((resolve) => {
    mainWindow.webContents.print(
      {
        silent: options.silent || false,
        printBackground: true,
        deviceName: options.deviceName || "",
        pageSize: options.pageSize || "A4",
      },
      (success, errorType) => {
        if (!success) {
          console.error("Print error:", errorType);
          resolve({ success: false, error: errorType });
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

// App Lifecycle
app.whenReady().then(() => {
  // Clear any stale HTTP cache on app startup
  session.defaultSession.clearCache().catch(() => {});

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
