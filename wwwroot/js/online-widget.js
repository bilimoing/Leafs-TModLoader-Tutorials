(() => {
  let started = false;
  window.tutorialSite.startOnlineWidget = () => {
    if (started) return;
    const host = document.getElementById('online-widget');
    if (!host) return;
    started = true;
    window._wau = window._wau || [];
    window._wau.push(['dynamic', 'wklm8qba6l', 'azm', 'c4302bffffff', 'small']);
    const marker = document.createElement('script');
    marker.id = '_wauazm';
    host.appendChild(marker);
    const loader = document.createElement('script');
    loader.src = 'https://waust.at/d.js';
    loader.async = true;
    loader.onerror = () => {
      const message = document.createElement('span');
      message.textContent = '在线人数暂不可用';
      host.appendChild(message);
    };
    host.appendChild(loader);
  };
})();
