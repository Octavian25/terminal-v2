const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const { SerialPort } = require("serialport");
var settingJson = require("./setting.json");
const { ReadlineParser } = require("@serialport/parser-readline");

contextBridge.exposeInMainWorld("api", {
  connectTimbangan: (func) => {
    console.log("MEMULAI TIMBANGAN");
    connectTimbangan();
  },
  getConfig: (func) => {
    const path = "setting.json";
    const data = fs.readFileSync(path, "utf8");
    func(data);
    // console.log(data);
  },
  send: (channel, data) => {
    // whitelist channels
    let validChannels = [
      "terminal.toTerm",
      "saveConfiguration",
      "timbangan.emmit",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["terminal.incData"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
let tryCount = 0;

var connectTimbangan = function () {
  const port = new SerialPort({
    path: settingJson.com || "COM3",
    baudRate: Number(settingJson.baudRate) || 9600,
    dataBits: Number(settingJson.dataBits) || 8,
    parity: settingJson.parity || "none",
    stopBits: Number(settingJson.stopBits) || 1,
  });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  parser.on("data", (temp) => {
    console.log(temp);
    ipcRenderer.send("timbangan.emmit", {
      temp: temp,
      url: settingJson.url,
    });
  });

  port.on("close", function () {
    console.log("PORT CLOSED");
    reconnectTimbangan();
  });

  port.on("error", function (err) {
    console.error("error", err);
    tryCount++;
    console.log(tryCount);
    if (tryCount > 10) {
      return false;
    }
    reconnectTimbangan();
  });
};
var reconnectTimbangan = function () {
  console.log("INITIATING RECONNECT");
  setTimeout(function () {
    console.log("RECONNECTING");
    connectTimbangan();
  }, 2000);
};
