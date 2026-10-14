(() => {
  function loadResource(type, name, url, integrity) {
    // 模块入口必须同步返回 URL，不能返回 Promise<string>。
    if (type === 'dotnetjs') return url;
    return fetchResource(name, url, integrity);
  }
  async function fetchResource(name, url, integrity) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, {
          integrity,
          cache: attempt === 0 ? 'default' : 'reload'
        });
        if (response.ok) return response;
        if (response.status !== 408 && response.status !== 429 && response.status < 500)
          throw Object.assign(new Error(`启动资源 ${name} 返回 HTTP ${response.status}`), { permanent: true });
        lastError = new Error(`启动资源 ${name} 返回 HTTP ${response.status}`);
      } catch (error) {
        if (error.permanent) throw error;
        lastError = error;
      }
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
    throw lastError;
  }
  window.tutorialBoot = { loadResource };
  Blazor.start({ loadBootResource: loadResource }).catch(error => {
    console.error('网站启动失败：', error);
    const loading = document.querySelector('.loading-screen p');
    if (loading) loading.textContent = '网站运行资源下载失败。请检查网络，或强制刷新后重试。';
    const banner = document.getElementById('blazor-error-ui');
    if (banner) banner.style.display = 'block';
  });
})();
