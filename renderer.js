const { remote } = require("electron");

// requisita uma instancia da janela atual
const mainWindow = remote.BrowserWindow.getFocusedWindow();

let minimizar = document.getElementById("minimizar");
minimizar.addEventListener("click", function (e) {
  e.preventDefault();
  mainWindow.minimize();
});

let maximizar = document.getElementById("maximizar");
maximizar.addEventListener("click", function (e) {
  e.preventDefault();
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    maximizar.textContent = "maximizar";
  } else {
    mainWindow.maximize();
    maximizar.textContent = "restaurar";
  }
});

let fechar = document.getElementById("fechar");
fechar.addEventListener("click", function (e) {
  e.preventDefault();
  mainWindow.close();
});

let fullscreen = document.getElementById("fullscreen");
fullscreen.addEventListener("click", function (e) {
  e.preventDefault();
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

let getgif = document.getElementById("getgif");
getgif.addEventListener("click", function (e) {
  e.preventDefault();

  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.status === 200) {
      let response = JSON.parse(httpRequest.response);
      let imgUrl = response.data.image_url;
      document.getElementById("show-gif").innerHTML = `<img src="${imgUrl}">`;
    }
  };
  httpRequest.open("GET", "");
  httpRequest.send();
});
