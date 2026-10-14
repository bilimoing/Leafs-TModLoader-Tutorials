const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(fetch) {
  const context = { window: {}, fetch, console, document: { querySelector() { return null; }, getElementById() { return null; } }, setTimeout(callback) { callback(); }, Blazor: { start() { return Promise.resolve(); } } };
  vm.runInNewContext(fs.readFileSync('wwwroot/js/boot.js', 'utf8'), context);
  return context.window.tutorialBoot.loadResource;
}
test('短暂网络失败重试并保留校验参数', async () => {
  const calls = [];
  const load = setup(async (url, options) => { calls.push({ url, options }); if (calls.length === 1) throw new TypeError('Failed to fetch'); return { ok: true }; });
  await load('assembly', 'app.wasm', '/app.wasm', 'sha256-test');
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.integrity, 'sha256-test');
  assert.equal(calls[1].options.cache, 'reload');
});
test('持续网络错误最多尝试三次', async () => {
  let count = 0;
  const load = setup(async () => { count++; throw new TypeError('Failed to fetch'); });
  await assert.rejects(load('assembly', 'app.wasm', '/app.wasm', 'sha256-test'));
  assert.equal(count, 3);
});
test('404 立即停止，模块入口交给运行时加载', async () => {
  let count = 0;
  const load = setup(async () => { count++; return { ok: false, status: 404 }; });
  await assert.rejects(load('assembly', 'app.wasm', '/app.wasm', ''), /404/);
  assert.equal(count, 1);
  assert.equal(await load('dotnetjs', 'dotnet.js', '/dotnet.js', ''), '/dotnet.js');
  assert.equal(count, 1);
});
