(() => {
  const maps = new WeakMap();
  function mount(host, kind) {
    if (!host || host.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    const url = new URL(`widgets/${kind}.html`, document.baseURI);
    frame.src = url.href;
    frame.title = kind === 'online' ? '当前在线访客人数' : '访问地区地图';
    frame.setAttribute('scrolling', 'no');
    frame.style.cssText = 'display:block;border:0;color-scheme:light;background:transparent';
    if (kind === 'online') {
      frame.width = '130'; frame.height = '30';
    } else {
      frame.width = '840'; frame.height = '420';
      frame.style.transformOrigin = 'top left';
      frame.style.maxWidth = 'none';
      const resize = () => {
        const scale = Math.min(1, host.clientWidth / 840);
        frame.style.transform = `scale(${scale})`;
        host.style.height = `${420 * scale}px`;
      };
      maps.get(host)?.disconnect();
      const observer = new ResizeObserver(resize);
      maps.set(host, observer);
      observer.observe(host);
      // 容器从页面移除后停止监听。
      frame.addEventListener('load', resize);
    }
    host.replaceChildren(frame);
  }
  const pending = new WeakSet();
  window.tutorialSite.startOnlineWidget = () => {
    const host = document.getElementById('online-widget');
    if (!host || host.querySelector('iframe') || pending.has(host)) return;
    pending.add(host);
    const load = () => {
      pending.delete(host);
      if (host.isConnected) mount(host, 'online');
    };
    if (window.requestIdleCallback) requestIdleCallback(load, { timeout: 1500 });
    else setTimeout(load, 250);
  };
  window.tutorialSite.mountVisitorMap = host => mount(host, 'map');
  window.tutorialSite.unmountVisitorMap = host => { maps.get(host)?.disconnect(); maps.delete(host); };
  function refreshOnline() {
    if (document.hidden) return;
    const frame = document.querySelector('#online-widget iframe');
    if (frame) frame.src = new URL('widgets/online.html?t=' + Date.now(), document.baseURI).href;
  }
  setInterval(refreshOnline, 90000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshOnline(); });
})();
