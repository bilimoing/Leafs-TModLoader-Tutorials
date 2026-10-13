import articles from './articles.mjs';
const encoder = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const random = () => crypto.randomUUID() + crypto.randomUUID();
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
async function hash(value) { return b64(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
async function key(env) { return crypto.subtle.importKey('raw', bytes(env.TOKEN_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']); }
async function seal(value, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return b64(iv) + '.' + b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(env), encoder.encode(value)));
}
async function open(value, env) {
  const [iv, ciphertext] = value.split('.');
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(iv) }, await key(env), bytes(ciphertext)));
}
export function validatePayload(value) {
  if (!value || !articles.includes(value.article)) throw new Error('教程不存在');
  for (const [field, max, required] of [['content', 2000, true], ['displayName', 40, false]]) {
    if (typeof value[field] !== 'string' || value[field].length > max || (required && !value[field].trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value[field])) throw new Error('评论或昵称格式无效');
  }
  if (typeof value.requestId !== 'string' || !/^[a-f\d-]{36}$/i.test(value.requestId)) throw new Error('提交编号无效');
  return { article: value.article, displayName: value.displayName.trim(), content: value.content.trim() };
}
function response(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }); }
async function json(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('需要 JSON 请求');
  const text = await request.text();
  if (encoder.encode(text).length > 16000) throw new Error('请求过大');
  return JSON.parse(text);
}
async function github(path, token, options = {}) {
  return fetch('https://api.github.com' + path, { ...options, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'Leaf-Tutorial-Comments', 'X-GitHub-Api-Version': '2022-11-28', ...(options.body ? { 'Content-Type': 'application/json' } : {}) } });
}
function callback(message, env) {
  const nonce = crypto.randomUUID();
  const data = JSON.stringify(message).replaceAll('<', '\\u003c');
  const origin = JSON.stringify(env.ALLOWED_ORIGIN);
  return new Response(`<!doctype html><meta charset="utf-8"><title>GitHub 登录</title><p>登录处理完成，请返回教程页面。</p><script nonce="${nonce}">if(window.opener){window.opener.postMessage(${data},${origin});window.close();}</script>`, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'` } });
}
async function route(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.TOKEN_KEY) return response({ error: '登录服务尚未配置' }, 503);
  if (path === '/auth/callback' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    const record = await env.DB.prepare('DELETE FROM oauth_states WHERE state = ? AND expires > ? RETURNING state').bind(await hash(state), now()).first();
    if (!record) return callback({ type: 'leaf-login', state, error: '授权已过期，请重新登录' }, env);
    try {
      const code = url.searchParams.get('code');
      if (!code || url.searchParams.has('error')) throw new Error('未完成 GitHub 授权');
      const exchanged = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: url.origin + '/auth/callback' })
      });
      const token = await exchanged.json();
      if (!exchanged.ok || !token.access_token) throw new Error('GitHub 授权失败');
      const userResponse = await github('/user', token.access_token);
      if (!userResponse.ok) throw new Error('无法获取 GitHub 账号');
      const user = await userResponse.json();
      const session = random();
      const expires = now() + Math.min(3600, Number(token.expires_in) || 3600);
      await env.DB.prepare('INSERT INTO sessions (id, token, login, expires) VALUES (?, ?, ?, ?)').bind(await hash(session), await seal(token.access_token, env), user.login, expires).run();
      return callback({ type: 'leaf-login', state, session, login: user.login }, env);
    } catch { return callback({ type: 'leaf-login', state, error: 'GitHub 登录失败，请重试并检查应用配置' }, env); }
  }
  if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) return response({ error: '来源不允许' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (path === '/auth/start' && request.method === 'POST') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM oauth_states WHERE expires <= ?').bind(now()),
      env.DB.prepare('DELETE FROM sessions WHERE expires <= ?').bind(now()),
      env.DB.prepare('DELETE FROM submissions WHERE created < ?').bind(now() - 86400)
    ]);
    const state = random();
    await env.DB.prepare('INSERT INTO oauth_states (state, expires) VALUES (?, ?)').bind(await hash(state), now() + 600).run();
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authorize.searchParams.set('state', state);
    authorize.searchParams.set('redirect_uri', url.origin + '/auth/callback');
    return response({ state, url: authorize.href });
  }
  const credential = request.headers.get('Authorization')?.replace(/^Bearer /, '') || '';
  const sessionId = await hash(credential);
  const session = await env.DB.prepare('SELECT * FROM sessions WHERE id = ? AND expires > ?').bind(sessionId, now()).first();
  if (!session) return response({ error: '登录已过期，请重新登录' }, 401);
  if (path === '/me' && request.method === 'GET') return response({ login: session.login });
  if (path === '/logout' && request.method === 'POST') {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return response({ ok: true });
  }
  if (path !== '/comments' || request.method !== 'POST') return response({ error: '接口不存在' }, 404);
  let input, payload;
  try { input = await json(request); payload = validatePayload(input); } catch { return response({ error: '请填写有效的教程、昵称和 1～2000 字评论' }, 400); }
  const previous = await env.DB.prepare('SELECT issue_number FROM submissions WHERE login = ? AND request_id = ?').bind(session.login, input.requestId).first();
  if (previous) return previous.issue_number ? response({ issueNumber: previous.issue_number }) : response({ error: '此投稿仍在处理或结果待确认，请稍后检查仓库，避免重复提交' }, 409);
  // 在单条 SQL 中占用提交编号并限流，避免多个并发请求绕过限制。
  const claimed = await env.DB.prepare('INSERT OR IGNORE INTO submissions (login, request_id, created) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM submissions WHERE login = ? AND created > ?)').bind(session.login, input.requestId, now(), session.login, now() - 60).run();
  if (!claimed.meta.changes) return response({ error: '请等待一分钟后再提交' }, 429);
  try {
    const body = '<!-- tutorial-comment:v1 -->\n```json\n' + JSON.stringify(payload) + '\n```\n\n通过教程网站投稿，等待维护者审核。';
    const created = await github(`/repos/${env.REPOSITORY}/issues`, await open(session.token, env), { method: 'POST', body: JSON.stringify({ title: '[评论] ' + payload.article, body }) });
    if (!created.ok) {
      await env.DB.prepare('DELETE FROM submissions WHERE login = ? AND request_id = ?').bind(session.login, input.requestId).run();
      return response({ error: created.status === 401 ? 'GitHub 授权已失效，请退出并重新登录' : 'GitHub 未接受投稿，请检查应用安装、Issue 权限或稍后重试' }, created.status === 401 ? 401 : 502);
    }
    const issue = await created.json();
    await env.DB.prepare('UPDATE submissions SET issue_number = ? WHERE login = ? AND request_id = ?').bind(issue.number, session.login, input.requestId).run();
    return response({ issueNumber: issue.number });
  } catch { return response({ error: '投稿结果暂时无法确认，请检查仓库 Issue，勿重复提交' }, 503); }
}
export default {
  async fetch(request, env) {
    let result;
    try { result = await route(request, env); } catch { result = response({ error: '评论服务暂时不可用' }, 503); }
    const headers = new Headers(result.headers);
    if (request.headers.get('Origin') === env.ALLOWED_ORIGIN) {
      headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGIN);
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      headers.set('Vary', 'Origin');
    }
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(result.body, { status: result.status, headers });
  }
};
