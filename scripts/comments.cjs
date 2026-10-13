const fs = require('node:fs');
const path = require('node:path');

function articleTitles(root = process.cwd()) {
  return fs.readdirSync(path.join(root, 'Pages', 'MD')).filter(n => n.endsWith('.md')).map(n => n.slice(0, -3));
}
function text(value, field, max, optional = false) {
  if (typeof value !== 'string' || (!optional && !value.trim()) || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) {
    throw new Error(`${field} 格式无效或长度超限`);
  }
  return value.trim();
}
function validateComment(comment, titles = articleTitles()) {
  if (!comment || typeof comment !== 'object' || Array.isArray(comment)) throw new Error('评论数据必须是对象');
  if (!titles.includes(comment.article)) throw new Error('教程不存在');
  text(comment.displayName, '昵称', 40);
  text(comment.content, '内容', 2000);
  if (!Number.isSafeInteger(comment.issueNumber) || comment.issueNumber < 1) throw new Error('Issue 编号无效');
  if (typeof comment.authorLogin !== 'string' || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(comment.authorLogin)) throw new Error('GitHub 用户名无效');
  for (const field of ['createdAt', 'approvedAt']) {
    if (typeof comment[field] !== 'string' || !/^\d{4}-\d\d-\d\dT/.test(comment[field]) || !Number.isFinite(Date.parse(comment[field]))) throw new Error(`${field} 时间无效`);
  }
  return comment;
}
function parseIssue(issue, approvedAt, titles = articleTitles()) {
  const body = issue.body || '';
  if (body.length > 20000) throw new Error('投稿数据过长');
  const match = /^<!-- tutorial-comment:v1 -->\r?\n```json\r?\n([^\r\n]+)\r?\n```(?:\r?\n|$)/.exec(body);
  if (!match) throw new Error('缺少网站生成的评论数据块，请从教程评论表单重新投稿');
  const payload = JSON.parse(match[1]);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('投稿数据无效');
  const displayName = text(payload.displayName, '昵称', 40, true) || issue.user.login;
  return validateComment({
    article: payload.article,
    displayName,
    content: text(payload.content, '内容', 2000),
    issueNumber: issue.number,
    authorLogin: issue.user.login,
    createdAt: issue.created_at,
    approvedAt
  }, titles);
}
function validateDirectory(root = process.cwd()) {
  const directory = path.join(root, 'Comments');
  const titles = articleTitles(root);
  for (const name of fs.readdirSync(directory).filter(n => n.endsWith('.json'))) {
    const comment = validateComment(JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')), titles);
    if (name !== `${comment.issueNumber}.json`) throw new Error(`评论文件名与 Issue 编号不一致：${name}`);
  }
}
module.exports = { parseIssue, validateComment, validateDirectory };
if (require.main === module) {
  validateDirectory();
  console.log('评论数据校验通过');
}
