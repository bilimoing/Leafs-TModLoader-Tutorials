const { app, BrowserWindow, nativeImage } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false, width: 256, height: 256, frame: false, webPreferences: { offscreen: true } });
  const svg = fs.readFileSync(path.resolve('wwwroot/images/leaf.svg'), 'utf8');
  await window.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent('<style>body{margin:0;background:#f2f7ed}svg{width:216px;height:216px;margin:20px}</style>' + svg));
  await new Promise(resolve => setTimeout(resolve, 200));
  const image = await window.webContents.capturePage();
  const png = nativeImage.createFromBuffer(image.toPNG()).resize({ width: 256, height: 256 }).toPNG();
  fs.mkdirSync('offline-app/windows/icons', { recursive: true });
  fs.writeFileSync('offline-app/windows/icons/leaf.png', png);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header[6] = 0; header[7] = 0; header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  fs.writeFileSync('offline-app/windows/icons/leaf.ico', Buffer.concat([header, png]));
  window.destroy(); app.quit();
}).catch(error => { console.error(error); app.exit(1); });
