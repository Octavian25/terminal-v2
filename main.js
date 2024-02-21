const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os");
const pty = require("node-pty");

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

function createWindow() {
  // Membuat jendela browser.
  const win = new BrowserWindow({
    width: 800,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
    },
    hasShadow: true,
    center: false,
    title: "Nagatech Timbangan",
  });

  // dan memuat file index.html dari aplikasi.
  win.loadFile("index.html");
  win.on("closed", function () {
    win = null;
  });

  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.onData("data", function (data) {
    win.webContents.send("terminal.incData", data);
  });
  ipcMain.on("terminal.toTerm", function (event, data) {
    ptyProcess.write(data);
  });
}

app.whenReady().then(createWindow);
