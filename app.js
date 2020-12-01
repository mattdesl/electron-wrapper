const { spawn } = require("child_process");
const path = require("path");
const { app, BrowserWindow } = require("electron");
const cli = require("canvas-sketch-cli");

let autostart = false;
let server;

async function createWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
  });

  win.on('closed', () => {
    app.quit();
  });

  process.chdir(path.resolve(__dirname));

  server = await cli(["sketch.js"], {
    port: 5921,
    stream: {
      format: 'mp4', // mp4 or gif
      // scale: '512:-2', // scale param for ffmpeg
      buffer: true // whether to buffer frames into memory or not, default false
    }
  });
  server.on("connect", (c) => {
    const query = autostart ? '?autostart' : '';
    win.loadURL(c.uri + query);
    win.show();
  });

  if (!autostart) win.webContents.openDevTools();
}

// app.whenReady().then(createWindow);
app.on("ready", createWindow);
app.on("quit", () => {
  if (server) {
    server.close();
    server = null;
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
