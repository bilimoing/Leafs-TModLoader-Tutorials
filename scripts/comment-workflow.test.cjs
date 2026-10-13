const { test } = require('node:test');
const assert = require('node:assert/strict');
const run = require('./create-comment-pr.cjs');
const { parseIssue } = require('./comments.cjs');
function fixture(options = {}) {
  const snapshot = {
    number: 42, state: 'open', created_at: '2026-10-13T12:00:00Z', user: { login: 'reader' },
    body: '<!-- tutorial-comment:v1 -->\n```json\n' + JSON.stringify({ article: '教程前言', displayName: '', content: '测试评论' }) + '\n```\n',
    labels: [{ name: '评论审核通过' }]
  };
  const calls = [];
  const github = { rest: {
    repos: {
      getCollaboratorPermissionLevel: async () => ({ data: { permission: options.permission || 'write' } }),
      get: async () => ({ data: { default_branch: 'main' } }),
      getContent: async ({ ref }) => {
        if (ref === 'main' && !options.published) throw Object.assign(new Error('不存在'), { status: 404 });
        const previous = parseIssue(snapshot, '2026-10-13T13:00:00Z');
        if (options.changedBranch) previous.content = '另一条评论';
        return { data: { encoding: 'base64', content: Buffer.from(JSON.stringify(previous)).toString('base64') } };
      }
    },
    issues: { get: async () => ({ data: options.edited ? { ...snapshot, body: snapshot.body + '编辑' } : snapshot }) },
    git: {
      getRef: async () => ({ data: { object: { sha: 'base-sha' } } }),
      getCommit: async () => ({ data: { tree: { sha: 'base-tree' } } }),
      createBlob: async input => { calls.push(['blob', input]); return { data: { sha: 'blob' } }; },
      createTree: async input => { calls.push(['tree', input]); return { data: { sha: 'tree' } }; },
      createCommit: async () => ({ data: { sha: 'commit' } }),
      createRef: async () => { if (options.branchExists) throw Object.assign(new Error('分支存在'), { status: 422 }); }
    },
    pulls: {
      list: async () => ({ data: options.prExists ? [{ html_url: '已有 PR' }] : [] }),
      create: async input => { calls.push(['pr', input]); return { data: { html_url: '新 PR' } }; }
    }
  } };
  return { github, context: { repo: { owner: 'owner', repo: 'repo' }, payload: { issue: snapshot, sender: { login: 'maintainer' } } }, core: { notice() {} }, calls };
}
test('审核只创建单个评论文件并打开 PR，不自动合并', async () => {
  const input = fixture();
  await run(input);
  const tree = input.calls.find(c => c[0] === 'tree')[1];
  assert.deepEqual(tree.tree.map(c => c.path), ['Comments/42.json']);
  const pr = input.calls.find(c => c[0] === 'pr')[1];
  assert.equal(pr.base, 'main');
  assert.equal(pr.head, 'comments/issue-42');
  assert.match(pr.body, /Closes #42/);
});
test('拒绝无权限审核者和审核后编辑的投稿', async () => {
  for (const options of [{ permission: 'read' }, { edited: true }]) {
    const input = fixture(options);
    await assert.rejects(run(input));
    assert.equal(input.calls.length, 0);
  }
});
test('已发布评论不会重复导入', async () => {
  const input = fixture({ published: true });
  await run(input);
  assert.equal(input.calls.length, 0);
});
test('分支已创建但 PR 创建失败时可重试', async () => {
  const input = fixture({ branchExists: true });
  await run(input);
  assert.equal(input.calls.filter(c => c[0] === 'pr').length, 1);
});
test('重试不覆盖内容不同的审核分支，也不重复创建已有 PR', async () => {
  const changed = fixture({ branchExists: true, changedBranch: true });
  await assert.rejects(run(changed));
  assert.equal(changed.calls.filter(c => c[0] === 'pr').length, 0);
  const existing = fixture({ branchExists: true, prExists: true });
  await run(existing);
  assert.equal(existing.calls.filter(c => c[0] === 'pr').length, 0);
});
