const { app, BrowserWindow, ipcMain, safeStorage } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
// const os = require("os");
// const pty = require("node-pty");

// var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

function createWindow() {
  // Membuat jendela browser.
  const win = new BrowserWindow({
    width: 800,
    height: 840,
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
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

  // var ptyProcess = pty.spawn(shell, [], {
  //   name: "xterm-color",
  //   cols: 80,
  //   rows: 24,
  //   cwd: process.env.HOME,
  //   env: process.env,
  // });

  // ptyProcess.onData("data", function (data) {
  //   win.webContents.send("terminal.incData", data);
  // });
  ipcMain.on("terminal.toTerm", function (event, data) {
    console.log(data);
  });
  ipcMain.on("timbangan.emmit", async function (event, data) {
    try {
      var url = data.url + "/api/v1/tmp-timbangan";
      await axios.post(
        url,
        {
          user_id: data.user_id,
          value: parseFloat(data.temp),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Dari Timbangan", data);
    } catch (error) {
      console.log(error);
    }
  });
  ipcMain.on("saveConfiguration", function (event, data) {
    const path = "setting.json";
    fs.writeFileSync(path, JSON.stringify(data), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Log entry added to file.");
      }
    });
  });
}

app.whenReady().then(createWindow);
