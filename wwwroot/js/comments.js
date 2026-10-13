(() => {
  let endpoint, session = sessionStorage.getItem('leaf-comment-session') || '';
  document.addEventListener('keydown', event => {
    const input = event.target;
    if (!(input instanceof HTMLTextAreaElement) || !input.hasAttribute('data-comment-input')) return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    const button = input.form?.querySelector('button[type="submit"]');
    if (event.repeat || !button || button.disabled) return;
    input.form.requestSubmit(button);
  });
  async function config() {
    if (!endpoint) {
      const result = await fetch(new URL('comments-config.json', document.baseURI), { cache: 'no-store' });
      const value = await result.json();
      if (!value.endpoint) throw new Error('评论登录服务尚未启用');
      const url = new URL(value.endpoint);
      if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('评论服务地址配置无效');
      endpoint = url.origin;
    }
    return endpoint;
  }
  async function api(path, method = 'GET', body) {
    const root = await config();
    const result = await fetch(root + path, { method, headers: { ...(session ? { Authorization: 'Bearer ' + session } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await result.json();
    if (!result.ok) {
      if (result.status === 401) { session = ''; sessionStorage.removeItem('leaf-comment-session'); }
      throw new Error(data.error || '评论服务请求失败');
    }
    return data;
  }
  window.tutorialComments = {
    async status() {
      try { await config(); return session ? { configured: true, ...(await api('/me')) } : { configured: true }; }
      catch (error) { return { configured: Boolean(endpoint), error: error.message }; }
    },
    async login() {
      // 先在点击事件中打开窗口，避免等待网络后被浏览器拦截。
      const popup = window.open('about:blank', 'leaf-github-login', 'width=620,height=760');
      if (!popup) throw new Error('请允许登录弹窗后重试');
      try {
        const root = await config();
        const start = await api('/auth/start', 'POST');
        return await new Promise((resolve, reject) => {
          let timer;
          const clean = () => { window.removeEventListener('message', receive); clearInterval(timer); };
          const receive = event => {
            if (event.origin !== root || event.source !== popup || event.data?.type !== 'leaf-login' || event.data.state !== start.state) return;
            clean(); popup.close();
            if (event.data.error) { reject(new Error(event.data.error)); return; }
            session = event.data.session;
            sessionStorage.setItem('leaf-comment-session', session);
            resolve({ login: event.data.login });
          };
          window.addEventListener('message', receive);
          const deadline = Date.now() + 600000;
          timer = setInterval(() => {
            if (popup.closed || Date.now() > deadline) { clean(); popup.close(); reject(new Error('登录已取消或超时')); }
          }, 500);
          popup.location.href = start.url;
        });
      } catch (error) { popup.close(); throw error; }
    },
    async logout() {
      try { if (session) await api('/logout', 'POST'); }
      finally { session = ''; sessionStorage.removeItem('leaf-comment-session'); }
    },
    submit(article, displayName, content, requestId) {
      return api('/comments', 'POST', { article, displayName, content, requestId });
    }
  };
})();
