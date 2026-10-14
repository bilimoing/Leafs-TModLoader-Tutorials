const { app, BrowserWindow, protocol, net, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
protocol.registerSchemesAsPrivileged([{ scheme: 'leaf', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);
let window;
app.whenReady().then(() => {
  const root = app.isPackaged ? path.join(process.resourcesPath, 'site') : path.resolve(__dirname, '../site');
  protocol.handle('leaf', request => {
    const url = new URL(request.url);
    if (url.host !== 'app') return new Response('', { status: 403 });
    let name;
    try { name = decodeURIComponent(url.pathname); } catch { return new Response('', { status: 400 }); }
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep)) return new Response('', { status: 403 });
    return net.fetch(pathToFileURL(file).href).then(response => {
      const types = { '.wasm': 'application/wasm', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml' };
      const headers = new Headers(response.headers);
      const type = types[path.extname(file).toLowerCase()];
      if (type) headers.set('Content-Type', type);
      return new Response(response.body, { status: response.status, headers });
    });
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
