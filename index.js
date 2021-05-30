const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname); //hot reload
}

let mainWindow;

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
