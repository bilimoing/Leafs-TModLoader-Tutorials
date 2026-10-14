(() => {
  function mount(host, kind) {
    if (!host || host.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = new URL(`widgets/${kind}.html`, document.baseURI).href;
    frame.title = kind === 'online' ? '当前在线访客人数' : '访问地区地图';
    frame.width = kind === 'online' ? '100' : '420';
    frame.height = kind === 'online' ? '30' : '210';
    frame.style.cssText = 'display:block;border:0;max-width:100%;color-scheme:light;background:transparent';
    host.replaceChildren(frame);
  }
  window.tutorialSite.startOnlineWidget = () => mount(document.getElementById('online-widget'), 'online');
  window.tutorialSite.mountVisitorMap = host => mount(host, 'map');
})();
