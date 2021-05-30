const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
  // autoUpdater,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname); //hot reload
}

let mainWindow;
let appTray = null;
let iconPath = path.join(__dirname, "inbox-tray.png");

app.setAppUserModelId("com.electron-aula");

function createWindows() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  let file = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file",
    slashes: true,
  });

  mainWindow.loadURL(file);
  mainWindow.openDevTools();

  mainWindow.on("maximize", () => console.log("Maximizado"));
}

app.whenReady().then(() => {
  // ----------------------------------------------------------------
  // criando um icone na bandeja
  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar aplicativo",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Sair",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  appTray = new Tray(iconPath);
  appTray.setToolTip("This is my application.");
  appTray.setContextMenu(contextMenu);

  appTray.on("click", function () {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  globalShortcut.register("CommandOrControl+x", function () {
    console.log("Atalho de ctrl + x");
  });

  globalShortcut.register("Alt+a", function () {
    console.log("Alt + a");
  });

  // deprecated -------------------------
  // mainWindow.on("show", function () {
  //   appTray.setHighlightMode("always");
  // });

  mainWindow.on("minimize", function (e) {
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("close", function (e) {
    if (app.isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
});

function sendStatusToWindow(text) {
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Atualização do aplicativo",
    message: "Detalhes:",
    detail: text,
  };

  dialog.showMessageBox(dialogOpts);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
});

app.on("ready", () => {
  autoUpdater.checkForUpdates();
  createWindows();
});
