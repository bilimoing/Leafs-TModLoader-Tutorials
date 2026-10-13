import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import worker, { validatePayload } from './worker.mjs';
import articles from './articles.mjs';
import fs from 'node:fs';
globalThis.crypto ||= webcrypto;
const origin = 'https://bilimoing.github.io';
const payload = { article: '教程前言', displayName: '昵称', content: '评论\n<script>纯文本</script>', requestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' };
async function fixture(options = {}) {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode('github-secret-token'));
  const b64 = value => Buffer.from(value).toString('base64');
  const record = { token: b64(iv) + '.' + b64(encrypted), login: 'real-reader' };
  const calls = [];
  const env = {
    ALLOWED_ORIGIN: origin, REPOSITORY: 'owner/repo', GITHUB_CLIENT_ID: 'client', GITHUB_CLIENT_SECRET: 'secret', TOKEN_KEY: b64(raw),
    DB: { prepare(sql) { return {
      bind(...args) { calls.push({ sql, args }); return this; },
      async first() {
        if (sql.startsWith('SELECT * FROM sessions')) return options.unauthorized ? null : record;
        if (sql.startsWith('SELECT issue_number')) return options.previous || null;
        return null;
      },
      async run() { return { meta: { changes: options.limited ? 0 : 1 } }; }
    }; } }
  };
  return { env, calls };
}
function request(path = '/comments', options = {}) {
  return new Request('https://comments.example' + path, { method: 'POST', headers: { Origin: origin, Authorization: 'Bearer session', 'Content-Type': 'application/json', ...options.headers }, body: JSON.stringify(options.body || payload) });
}
test('服务端教程清单与当前教程一致', () => {
  const current = fs.readdirSync(new URL('../Pages/MD/', import.meta.url)).filter(n => n.endsWith('.md')).map(n => n.slice(0, -3));
  assert.deepEqual([...articles].sort(), current.sort());
});
test('校验内容长度、教程和提交编号，忽略伪造作者', () => {
  assert.equal(validatePayload({ ...payload, authorLogin: 'fake' }).authorLogin, undefined);
  for (const patch of [{ article: '../fake' }, { content: 'a'.repeat(2001) }, { displayName: 'a'.repeat(41) }, { content: '\u0000' }, { requestId: '../fake' }]) assert.throws(() => validatePayload({ ...payload, ...patch }));
});
test('拒绝未登录与错误来源', async () => {
  const { env } = await fixture({ unauthorized: true });
  assert.equal((await worker.fetch(request(), env)).status, 401);
  const response = await worker.fetch(request('/comments', { headers: { Origin: 'https://evil.example' } }), env);
  assert.equal(response.status, 403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});
test('允许预检但只对配置站点返回跨域许可', async () => {
  const { env } = await fixture();
  const response = await worker.fetch(new Request('https://comments.example/comments', { method: 'OPTIONS', headers: { Origin: origin } }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});
test('重复提交、待确认投稿和限流都不会请求 GitHub', async () => {
  for (const [options, status] of [[{ previous: { issue_number: 42 } }, 200], [{ previous: { issue_number: null } }, 409], [{ limited: true }, 429]]) {
    const { env } = await fixture(options);
    assert.equal((await worker.fetch(request(), env)).status, status);
  }
});
test('服务端用授权令牌创建 Issue，返回值不包含令牌', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, options) => { sent = { url, ...options }; return new Response(JSON.stringify({ number: 42 }), { status: 201 }); };
  try {
    const { env, calls } = await fixture();
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { issueNumber: 42 });
    assert.equal(sent.url, 'https://api.github.com/repos/owner/repo/issues');
    assert.equal(sent.headers.Authorization, 'Bearer github-secret-token');
    const issue = JSON.parse(sent.body);
    assert.match(issue.body, /^<!-- tutorial-comment:v1 -->/);
    assert.equal(JSON.parse(issue.body.split('\n')[2]).authorLogin, undefined);
    assert.ok(calls.some(c => c.sql.startsWith('UPDATE submissions')));
  } finally { globalThis.fetch = original; }
});
test('无效或过期授权状态不进行授权码交换', async () => {
  const { env } = await fixture();
  const response = await worker.fetch(new Request('https://comments.example/auth/callback?state=unknown&code=code'), env);
  assert.match(await response.text(), /授权已过期/);
  assert.match(response.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
});
