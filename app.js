const { spawn } = require("child_process");
const path = require("path");
const { app, BrowserWindow } = require("electron");
const waitForLocalhost = require("wait-for-localhost");
const cli = require("canvas-sketch-cli");

let server;

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

  server = await cli(["sketch.js", "--stream", "--port", 9966]);

  win.loadURL("http://localhost:9966/");
  await waitForLocalhost({ port: 9966 });
  win.show();
  win.webContents.reloadIgnoringCache();
  // win.webContents.openDevTools();
}

// app.whenReady().then(createWindow);
app.on("ready", createWindow);
app.on("quit", () => {
  if (server) {
    console.log("quitting");
    server.close();
    server = null;
  }
});
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
