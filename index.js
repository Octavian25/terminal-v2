var term = new Terminal({
  convertEol: true,
});
term.open(document.getElementById("terminal"));
term.write("Selamat Datang...\n\n");
term.write(
  "1. Sesuaikan COM, url, Baud Rate, Data Bits, Stop Bits dan Parity Sesuai Timbangan Anda\n"
);
term.write(
  '2. Setelah Semua Dirasa Sesuai, Tekan Tombol "Simpan Pengaturan"\n'
);
term.write('3. Tekan "Mulai Timbangan" Untuk memulai proses penimbangan\n\n\n');
// term.onData((e) => {
//   ipc.send("terminal.toTerm", e);
// });

function main() {
  window.api.getConfig((data) => {
    var data = JSON.parse(data);
    document.getElementById("com").value = data.com;
    document.getElementById("url").value = data.url;
    document.getElementById("baudRate").value = data.baudRate;
    document.getElementById("parity").value = data.parity;
    document.getElementById("dataBits").value = data.dataBits;
    document.getElementById("stopBits").value = data.stopBits;
    document.getElementById("userID").value = data.userID;
  });
}

main();

function handleSave() {
  var com = document.getElementById("com").value;
  var url = document.getElementById("url").value;
  var baudRate = document.getElementById("baudRate").value;
  var parity = document.getElementById("parity").value;
  var dataBits = document.getElementById("dataBits").value;
  var stopBits = document.getElementById("stopBits").value;
  var userID = document.getElementById("userID").value;
  term.write(
    `${com}, ${url}, ${baudRate}, ${parity}, ${dataBits}, ${stopBits}, ${userID}`
  );
  alert(`Pengaturan Tersimpan..`);
  let data = {
    com,
    url,
    baudRate,
    parity,
    dataBits,
    stopBits,
    userID,
  };
  window.api.send("saveConfiguration", data);
  localStorage.setItem("prevData", data);
}

function handleStart() {
  // window.api.connectTimbangan();
  window.api.send("timbangan.emmit", {
    url: "http://103.150.191.156:3002",
    user_id: "MrPopeye",
    temp: 2.313,
  });
}
