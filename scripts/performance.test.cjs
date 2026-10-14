const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function element() {
  return { isConnected: true, children: [], attributes: {}, style: {}, setAttribute(k, v) { this.attributes[k] = v; }, replaceChildren(...nodes) { this.children = nodes; }, querySelector(tag) { return this.children.find(n => n.tag === tag) || null; }, addEventListener() {} };
}
test('评论接近视口才加载，卸载后不再插入第三方脚本', () => {
  const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const context = { window: { IntersectionObserver: Observer }, document: { documentElement: { dataset: { theme: 'light' } }, createElement(tag) { return { ...element(), tag }; } }, IntersectionObserver: Observer, MutationObserver: Observer };
  vm.runInNewContext(fs.readFileSync('wwwroot/js/comments.js', 'utf8'), context);
  const host = element();
  context.window.tutorialComments.mount(host, '教程前言');
  assert.equal(host.children.length, 0);
  observers[0].callback([{ isIntersecting: true }]);
  assert.equal(host.children[0].src, 'https://utteranc.es/client.js');
  assert.equal(host.children[0].attributes['issue-term'], '教程留言：教程前言');
  context.window.tutorialComments.unmount(host);
  assert.ok(observers.every(o => o.disconnected));
  observers[0].callback([{ isIntersecting: true }]);
  assert.equal(host.children.length, 0);
});
test('统计空闲时启动且同一容器不重复加载，后台不刷新', () => {
  const host = element(), jobs = [];
  const context = {
    window: { tutorialSite: {}, requestIdleCallback(callback) { jobs.push(callback); } },
    document: { baseURI: 'https://example.com/tutorials/', hidden: false, getElementById() { return host; }, querySelector() { return host.querySelector('iframe'); }, createElement(tag) { return { ...element(), tag }; }, addEventListener() {} },
    URL, WeakMap, WeakSet, setTimeout(callback) { jobs.push(callback); }, setInterval(callback) { jobs.push(callback); }, requestIdleCallback(callback) { jobs.push(callback); }
  };
  vm.runInNewContext(fs.readFileSync('wwwroot/js/online-widget.js', 'utf8'), context);
  context.window.tutorialSite.startOnlineWidget();
  context.window.tutorialSite.startOnlineWidget();
  assert.equal(host.children.length, 0);
  assert.equal(jobs.length, 2);
  jobs[1]();
  assert.equal(host.children.length, 1);
  assert.equal(host.children[0].src, 'https://example.com/tutorials/widgets/online.html');
  context.document.hidden = true;
  jobs[0]();
  assert.equal(host.children[0].src, 'https://example.com/tutorials/widgets/online.html');
});
