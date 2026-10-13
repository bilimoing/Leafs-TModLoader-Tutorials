const { parseIssue } = require('./comments.cjs');

module.exports = async ({ github, context, core }) => {
  const repo = context.repo;
  const snapshot = context.payload.issue;
  if (snapshot.pull_request || snapshot.state !== 'open') throw new Error('只能审核未关闭的评论 Issue');
  const permission = await github.rest.repos.getCollaboratorPermissionLevel({ ...repo, username: context.payload.sender.login });
  if (!['admin', 'maintain', 'write'].includes(permission.data.permission)) throw new Error('只有仓库维护者可以审核评论');
  const { data: current } = await github.rest.issues.get({ ...repo, issue_number: snapshot.number });
  if (current.state !== 'open' || !current.labels.some(l => l.name === '评论审核通过') || current.body !== snapshot.body) {
    throw new Error('投稿在审核后发生变化，请检查最新内容并重新添加审核标签');
  }
  const comment = parseIssue(snapshot, new Date().toISOString());
  const filePath = `Comments/${comment.issueNumber}.json`;
  const { data: repository } = await github.rest.repos.get(repo);
  const base = repository.default_branch;
  try {
    await github.rest.repos.getContent({ ...repo, path: filePath, ref: base });
    core.notice('此 Issue 已导入，请通过新的 PR 修改已发布评论');
    return;
  } catch (error) { if (error.status !== 404) throw error; }
  const branch = `comments/issue-${comment.issueNumber}`;
  const { data: baseRef } = await github.rest.git.getRef({ ...repo, ref: `heads/${base}` });
  const { data: baseCommit } = await github.rest.git.getCommit({ ...repo, commit_sha: baseRef.object.sha });
  const { data: blob } = await github.rest.git.createBlob({ ...repo, content: JSON.stringify(comment, null, 2) + '\n', encoding: 'utf-8' });
  const { data: tree } = await github.rest.git.createTree({ ...repo, base_tree: baseCommit.tree.sha, tree: [{ path: filePath, mode: '100644', type: 'blob', sha: blob.sha }] });
  const { data: commit } = await github.rest.git.createCommit({ ...repo, message: `发布审核评论 #${comment.issueNumber}`, tree: tree.sha, parents: [baseRef.object.sha] });
  try {
    await github.rest.git.createRef({ ...repo, ref: `refs/heads/${branch}`, sha: commit.sha });
  } catch (error) {
    if (error.status !== 422) throw error;
    const { data: saved } = await github.rest.repos.getContent({ ...repo, path: filePath, ref: branch });
    if (!saved.content || saved.encoding !== 'base64') throw new Error('已有审核分支中的评论文件无效');
    const previous = JSON.parse(Buffer.from(saved.content, 'base64').toString('utf8'));
    const fields = ['article', 'displayName', 'content', 'issueNumber', 'authorLogin', 'createdAt'];
    if (fields.some(field => previous[field] !== comment[field])) {
      throw new Error('已有审核分支的内容与此次审核不同。请先关闭旧 PR 并删除审核分支，再重新审核。');
    }
  }
  const { data: existing } = await github.rest.pulls.list({ ...repo, state: 'open', head: `${repo.owner}:${branch}`, base });
  if (existing.length) { core.notice(`已有评论 PR：${existing[0].html_url}`); return; }
  const { data: pr } = await github.rest.pulls.create({
    ...repo, base, head: branch,
    title: `发布教程评论 #${comment.issueNumber}`,
    body: `此 PR 保存维护者审核时的评论快照。\n\n来源：#${comment.issueNumber}\n\n请检查新增评论文件。合并后由现有 Pages 工作流构建部署。后续编辑 Issue 不会自动更新评论。\n\nCloses #${comment.issueNumber}`
  });
  core.notice(`已生成评论 PR：${pr.html_url}`);
};
