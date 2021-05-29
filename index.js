const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindows() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  let file = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file",
    slashes: true,
  });

  mainWindow.loadURL(file);
}

app.on("ready", createWindows);
