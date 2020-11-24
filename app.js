const { spawn } = require("child_process");
const path = require("path");
const { app, BrowserWindow } = require("electron");
const waitForLocalhost = require("wait-for-localhost");

async function createWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    // webPreferences: {
    // nodeIntegration: true,
    // },
  });

  process.chdir(path.resolve(__dirname));
  spawn("canvas-sketch", ["sketch.js", "--stream"], {
    stdio: "inherit",
  });

  // await require('canvas-sketch-cli')('sketch.js')

  win.loadURL("http://localhost:9966/");
  await waitForLocalhost({ port: 9966 });
  win.show();
  win.webContents.reloadIgnoringCache();
  // win.webContents.openDevTools();
}

// app.whenReady().then(createWindow);
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
