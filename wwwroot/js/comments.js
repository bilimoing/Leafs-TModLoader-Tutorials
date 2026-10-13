(() => {
  const mounts = new WeakMap();
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'github-dark' : 'github-light';
  window.tutorialComments = {
    mount(host, article) {
      this.unmount(host);
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', 'bilimoing/Leafs-TModLoader-Tutorials');
      // 同一路径上的教程以独立标识关联，避免查询参数页面共用讨论。
      script.setAttribute('issue-term', '教程留言：' + article);
      script.setAttribute('theme', theme());
      script.crossOrigin = 'anonymous';
      script.async = true;
      const observer = new MutationObserver(() => {
        const frame = host.querySelector('iframe');
        frame?.contentWindow?.postMessage({ type: 'set-theme', theme: theme() }, 'https://utteranc.es');
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      mounts.set(host, observer);
      host.replaceChildren(script);
    },
    unmount(host) {
      mounts.get(host)?.disconnect();
      mounts.delete(host);
      host.replaceChildren();
    }
  };
})();
