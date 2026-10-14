const { app, BrowserWindow } = require('electron');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv[2] || 'release/wwwroot');
let server, win;
const types = { '.wasm': 'application/wasm', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png' };
app.whenReady().then(() => {
  server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data);
    });
  }).listen(0, '127.0.0.1', async () => {
    win = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
    win.webContents.on('console-message', (_event, _level, message) => { if (/Unhandled|Failed to start|Error:/.test(message)) console.error(message); });
    await win.loadURL(`http://127.0.0.1:${server.address().port}/`);
    const deadline = Date.now() + 45000;
    async function poll(article) {
      const result = await win.webContents.executeJavaScript(`({ready:!!document.querySelector(${JSON.stringify(article ? '.markdown' : '.hero')}),error:getComputedStyle(document.getElementById('blazor-error-ui')).display,text:document.querySelector('h1')?.textContent})`);
      if (result.error !== 'none') throw new Error('页面错误栏出现');
      if (result.ready) { console.log(JSON.stringify(result)); return; }
      if (Date.now() > deadline) throw new Error('启动超时');
      await new Promise(resolve => setTimeout(resolve, 250)); return poll(article);
    }
    try {
      await poll(false);
      await win.webContents.executeJavaScript("document.querySelector('a[href=\"?article=教程前言\"]').click()");
      await poll(true);
      console.log('浏览器首页启动与教程切换通过');
      win.destroy(); server.close(); app.exit(0);
    } catch (error) { console.error(error); win.destroy(); server.close(); app.exit(1); }
  });
});
setTimeout(() => { console.error('浏览器验证超时'); app.exit(1); }, 60000);
