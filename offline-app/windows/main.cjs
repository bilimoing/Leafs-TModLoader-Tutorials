const { app, BrowserWindow, protocol, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
protocol.registerSchemesAsPrivileged([{ scheme: 'leaf', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);
let window;
app.whenReady().then(() => {
  const root = app.isPackaged ? path.join(process.resourcesPath, 'site') : path.resolve(__dirname, '../site');
  protocol.handle('leaf', async request => {
    const url = new URL(request.url);
    if (url.host !== 'app') return new Response('', { status: 403 });
    let name;
    try { name = decodeURIComponent(url.pathname); } catch { return new Response('', { status: 400 }); }
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep)) return new Response('', { status: 403 });
    const types = { '.wasm': 'application/wasm', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
    try {
      return new Response(await fs.readFile(file), { headers: { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' } });
    } catch { return new Response('', { status: 404 }); }
  });
  window = new BrowserWindow({ width: 1250, height: 850, minWidth: 420, title: '叶子的 tModLoader 教程 · 离线版', webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  window.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  window.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('leaf://app/')) { event.preventDefault(); if (/^https?:\/\//.test(url)) shell.openExternal(url); }
  });
  window.webContents.session.webRequest.onBeforeRequest((details, callback) => callback({ cancel: !details.url.startsWith('leaf://app/') && !details.url.startsWith('devtools:') }));
  window.loadURL('leaf://app/');
});
app.on('window-all-closed', () => app.quit());
