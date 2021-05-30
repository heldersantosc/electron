const { app, BrowserWindow, Menu, Tray } = require("electron");
const url = require("url");
const path = require("path");

if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname); //hot reload
}

let mainWindow;
let iconPath = path.join(__dirname, "inbox-tray.png");
let appTray = null;

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
app.on("ready", createWindows);

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
