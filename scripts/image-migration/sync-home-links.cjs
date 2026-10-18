const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const markdownDir = path.resolve(root, process.argv[2] || 'Pages/MD');
const homePath = path.resolve(root, process.argv[3] || path.join('Pages/MD', '主页.md'));
const aliasPath = path.resolve(root, process.argv[4] || path.join('scripts', 'image-migration', 'home-link-aliases.json'));

function normalize(value) {
  return value
    .replace(/>/g, '>')
    .replace(/&/g, '&')
    .replace(/>>+$/g, '')
    .replace(/[\\*_~`#]/g, '')
    .replace(/[：:，,。！？!?（）()【】\[\]]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

const aliases = fs.existsSync(aliasPath) ? JSON.parse(fs.readFileSync(aliasPath, 'utf8')) : {};
const files = fs.readdirSync(markdownDir).filter((file) => file.toLowerCase().endsWith('.md'));
const titles = new Map(files.map((file) => [normalize(path.basename(file, '.md')), path.basename(file, '.md')]));
for (const [alias, title] of Object.entries(aliases)) {
  if (titles.has(normalize(title))) titles.set(normalize(alias), titles.get(normalize(title)));
}

let source = fs.readFileSync(homePath, 'utf8');
let changed = 0;
source = source.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (whole, label, url) => {
  if (/^https?:\/\//i.test(url) && !/^https?:\/\/(?:www\.)?kdocs\.cn\//i.test(url)) return whole;
  const title = titles.get(normalize(label));
  if (!title || title === '主页') return whole;
  const localUrl = `${encodeURIComponent(title)}.md`;
  if (url === localUrl) return whole;
  changed++;
  return `[${label}](${localUrl})`;
});
fs.writeFileSync(homePath, source);
console.log(`主页链接同步完成：${changed} 条，Markdown 文件：${files.length} 个。`);
