const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const root = 'offline-app/site';
test('离线入口包含运行标记且本地脚本可用', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /window.LEAF_OFFLINE=true/);
  assert.match(html, /<base href="\/"/);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const name = match[1].split('?')[0];
    if (name === '/' || /^https?:/.test(name)) continue;
    assert.ok(fs.existsSync(path.join(root, decodeURIComponent(name))), '缺少入口资源：' + name);
  }
});
test('全部教程图片打包且内容一致', () => {
  const source = 'wwwroot/images/tutorials';
  for (const name of fs.readdirSync(source)) {
    assert.deepEqual(fs.readFileSync(path.join(root, 'images/tutorials', name)), fs.readFileSync(path.join(source, name)), '图片不完整：' + name);
  }
});
test('运行时加载清单中的资源可用', () => {
  const framework = path.join(root, '_framework');
  assert.ok(fs.readdirSync(framework).some(n => n.endsWith('.wasm')));
  assert.ok(fs.readdirSync(framework).some(n => n.startsWith('blazor.webassembly') && n.endsWith('.js')));
});
