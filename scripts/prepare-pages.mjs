import fs from 'node:fs';
import path from 'node:path';
const output = process.argv[2] || 'release/wwwroot';
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const base = process.env.PAGES_BASE_PATH || (!repository || repository.toLowerCase().endsWith('.github.io') ? '/' : '/' + repository + '/');
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('站点路径必须以斜杠开头和结尾');
const statsEndpoint = process.env.STATS_ENDPOINT?.trim();
if (statsEndpoint) {
  const url = new URL(statsEndpoint);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('统计地址必须是 HTTPS 地址，且不能包含账号密码');
  }
  fs.writeFileSync(path.join(output, 'stats-config.json'), JSON.stringify({ endpoint: url.href }, null, 2) + '\n');
  console.log('已配置统计服务地址');
}
const entry = path.join(output, 'index.html');
const original = fs.readFileSync(entry, 'utf8');
const start = original.indexOf('<base ');
const end = original.indexOf('>', start);
if(start === -1 || end === -1) throw new Error('发布首页缺少基础路径标签');
const html = original.slice(0,start) + '<base href=' + String.fromCharCode(34) + base + String.fromCharCode(34) + ' />' + original.slice(end+1);
fs.writeFileSync(entry, html);
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('已配置 GitHub Pages 路径：' + base);

const version=process.env.GITHUB_SHA?.slice(0,12)||Date.now().toString();
let versioned=fs.readFileSync(entry,'utf8');
for(const asset of ['js/image-viewer.js','js/page-transition.js','css/app.css','js/site.js','js/stats.js','js/comments.js','js/highlight.js','js/wind.js','images/tree.svg','images/leaf.svg'])versioned=versioned.split(asset+String.fromCharCode(34)).join(asset+'?v='+version+String.fromCharCode(34));
fs.writeFileSync(entry,versioned);
fs.writeFileSync(path.join(output,'version.json'),JSON.stringify({version,builtAt:new Date().toISOString()}));
