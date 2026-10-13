const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseIssue, validateComment } = require('./comments.cjs');
const titles = ['教程前言'];
const time = '2026-10-13T12:00:00Z';
function issue(payload = { article: titles[0], displayName: '', content: '第一行\n<script>alert(1)</script>\n```代码```' }) {
  return { number: 42, user: { login: 'actual-user' }, created_at: time,
    body: '<!-- tutorial-comment:v1 -->\n```json\n' + JSON.stringify(payload) + '\n```\n\n投稿说明' };
}
test('保留多行纯文本并使用实际 Issue 作者，不信任投稿中的账号字段', () => {
  const data = { article: titles[0], displayName: '', content: '第一行\n<script>alert(1)</script>', authorLogin: 'fake-user' };
  const comment = parseIssue(issue(data), time, titles);
  assert.equal(comment.authorLogin, 'actual-user');
  assert.equal(comment.displayName, 'actual-user');
  assert.equal(comment.content, data.content);
  assert.equal(comment.issueNumber, 42);
});
test('支持自定义昵称和 Windows 换行', () => {
  const input = issue({ article: titles[0], displayName: '  叶子  ', content: '评论' });
  input.body = input.body.replaceAll('\n', '\r\n');
  assert.equal(parseIssue(input, time, titles).displayName, '叶子');
});
test('拒绝未知教程、超长内容、空评论和非法控制字符', () => {
  for (const payload of [
    { article: '../非法路径', displayName: '', content: '评论' },
    { article: titles[0], displayName: '', content: 'a'.repeat(2001) },
    { article: titles[0], displayName: 'a'.repeat(41), content: '评论' },
    { article: titles[0], displayName: '', content: '  ' },
    { article: titles[0], displayName: '', content: '\u0000评论' }
  ]) assert.throws(() => parseIssue(issue(payload), time, titles));
});
test('拒绝没有协议标记、伪造代码块和非法 JSON 的投稿', () => {
  for (const body of ['普通 Issue', '前缀\n' + issue().body, '<!-- tutorial-comment:v1 -->\n```json\n{坏数据}\n```']) {
    assert.throws(() => parseIssue({ ...issue(), body }, time, titles));
  }
});
test('拒绝非法作者、编号和时间', () => {
  const valid = parseIssue(issue(), time, titles);
  for (const patch of [{ authorLogin: '../fake' }, { issueNumber: -1 }, { createdAt: '无效日期' }, { approvedAt: 123 }]) {
    assert.throws(() => validateComment({ ...valid, ...patch }, titles));
  }
});
