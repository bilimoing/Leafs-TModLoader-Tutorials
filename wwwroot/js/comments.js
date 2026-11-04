(() => {
  const mounts = new WeakMap();
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'github-dark' : 'github-light';
  window.tutorialComments = {
    mount(host, article) {
      if (!host) return;
      this.unmount(host);
      const state = { visibility: null, theme: null };
      mounts.set(host, state);
      const load = () => {
        state.visibility?.disconnect();
        if (!host.isConnected || mounts.get(host) !== state) return;
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'bilimoing/Leafs-TModLoader-Tutorials');
        script.setAttribute('issue-term', '教程留言：' + article);
        script.setAttribute('theme', theme());
        script.crossOrigin = 'anonymous';
        script.async = true;
        state.theme = new MutationObserver(() => {
          host.querySelector('iframe')?.contentWindow?.postMessage({ type: 'set-theme', theme: theme() }, 'https://utteranc.es');
        });
        state.theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        host.replaceChildren(script);
      };
      if ('IntersectionObserver' in window) {
        state.visibility = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) load();
        }, { rootMargin: '400px' });
        state.visibility.observe(host);
      } else load();
    },
    unmount(host) {
      if (!host) return;
      const state = mounts.get(host);
      state?.visibility?.disconnect();
      state?.theme?.disconnect();
      mounts.delete(host);
      host.replaceChildren();
    }
  };
})();
