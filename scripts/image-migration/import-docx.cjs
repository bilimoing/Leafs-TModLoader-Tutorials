const fs = require('node:fs');
const cp = require('node:child_process');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const defaultSource = 'C:/Users/32387/Downloads';
const args = process.argv.slice(2);
const sourceArg = args.find((arg) => !arg.startsWith('--'));
const sourcePath = path.resolve(root, sourceArg || defaultSource);
const titleArg = args.find((arg) => arg.startsWith('--title='))?.slice('--title='.length);
const mdArg = args.find((arg) => arg.startsWith('--md='))?.slice('--md='.length);
const layoutKeyArg = args.find((arg) => arg.startsWith('--layout-key='))?.slice('--layout-key='.length);
const forceArg = args.includes('--force');

function fail(message) {
  console.error(`错误：${message}`);
  process.exitCode = 1;
}

function findDocx(input) {
  if (fs.existsSync(input) && fs.statSync(input).isFile()) return input;
  if (!fs.existsSync(input) || !fs.statSync(input).isDirectory()) return null;
  const files = fs.readdirSync(input).filter((file) => file.toLowerCase().endsWith('.docx'));
  if (files.length === 1) return path.join(input, files[0]);
  if (files.length === 0) return null;
  fail(`目录中存在多个 DOCX，请直接把目标文件拖到 import-docx.cmd 上，或传入完整路径：\n${files.map((file) => `  ${path.join(input, file)}`).join('\n')}`);
  return null;
}

const docx = findDocx(sourcePath);
if (!docx) {
  if (!process.exitCode) fail(`找不到 DOCX：${sourcePath}\n用法：node scripts/image-migration/import-docx.cjs "文件.docx"`);
  return;
}

function readZipEntry(entry, binary = false) {
  return cp.execFileSync('tar', ['-xOf', docx, entry], binary
    ? { maxBuffer: 50 * 1024 * 1024 }
    : { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

function decodeXml(text) {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function cleanXmlText(xml) {
  return decodeXml(xml.replace(/<w:tab[^>]*\/>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function readSize(paragraph) {
  const extent = paragraph.match(/<wp:extent[^>]*cx="(\d+)"[^>]*cy="(\d+)"/);
  if (!extent) return { width: 0, height: 0 };
  return {
    width: Math.round((Number(extent[1]) / 9525) * 100) / 100,
    height: Math.round((Number(extent[2]) / 9525) * 100) / 100
  };
}

const documentXml = readZipEntry('word/document.xml');
const relationsXml = readZipEntry('word/_rels/document.xml.rels');
const relations = new Map();
for (const match of relationsXml.matchAll(/<Relationship\s+([^>]+?)\s*\/?\s*>/g)) {
  const attrs = Object.fromEntries([...match[1].matchAll(/([\w:]+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]));
  if (attrs.Id && attrs.Target) relations.set(attrs.Id, attrs.Target);
}

const paragraphs = [...documentXml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((match) => match[0]);
const images = [];
for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
  const paragraph = paragraphs[paragraphIndex];
  const ids = [...paragraph.matchAll(/r:embed="([^"]+)"/g)].map((match) => match[1]);
  for (const id of ids) {
    const target = relations.get(id);
    if (!target || !target.includes('media/')) continue;
    const previous = paragraphs.slice(0, paragraphIndex).map(cleanXmlText).filter(Boolean).at(-1) || '';
    images.push({
      target: `word/${target.replace(/^\.\//, '')}`,
      relationship: id,
      size: readSize(paragraph),
      previous,
      text: cleanXmlText(paragraph)
    });
  }
}

const baseName = path.basename(docx, path.extname(docx));
const title = titleArg || baseName;
const markdownPath = path.resolve(root, mdArg || `Pages/MD/${title}.md`);
const layoutPath = path.resolve(root, 'Services/image-layout.json');
const outputDir = path.resolve(root, 'wwwroot/images/tutorials');
fs.mkdirSync(outputDir, { recursive: true });

let markdown = fs.existsSync(markdownPath) ? fs.readFileSync(markdownPath, 'utf8') : '';
if (!markdown) {
  const body = paragraphs.map((p) => decodeXml(p.replace(/<w:tab[^>]*\/>/g, '\t').replace(/<[^>]+>/g, '').trim())).filter(Boolean);
  markdown = `# ${title}\n\n${body.join('\n\n')}\n`;
}

const oldRefs = [...markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((match) => ({
  whole: match[0],
  alt: match[1],
  url: match[2]
}));
if (oldRefs.length > images.length) {
  fail(`Markdown 图片数量 ${oldRefs.length} 多于 DOCX 图片数量 ${images.length}：${markdownPath}`);
  return;
}
if (oldRefs.length && oldRefs.length !== images.length && !forceArg) {
  console.warn(`警告：Markdown 已有 ${oldRefs.length} 张图，DOCX 有 ${images.length} 张图，将按顺序替换并按上下文插入缺少的图片。`);
}

const layouts = [];
for (let index = 0; index < images.length; index++) {
  const image = images[index];
  const bytes = readZipEntry(image.target, true);
  const extension = path.extname(image.target).toLowerCase() || '.png';
  const filename = `${crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 24)}${extension}`;
  fs.writeFileSync(path.join(outputDir, filename), bytes);
  const localUrl = `images/tutorials/${filename}`;

  if (oldRefs[index]) {
    markdown = markdown.replace(oldRefs[index].whole, `![${oldRefs[index].alt || `教程配图 ${index + 1}`}](${localUrl})`);
  } else {
    const insertion = `\n\n![教程配图 ${index + 1}](${localUrl})\n`;
    const anchor = image.previous ? markdown.indexOf(image.previous) : -1;
    if (anchor >= 0) {
      const lineEnd = markdown.indexOf('\n', anchor);
      const position = lineEnd < 0 ? markdown.length : lineEnd;
      markdown = markdown.slice(0, position) + insertion + markdown.slice(position);
    } else {
      markdown += insertion;
    }
  }

  layouts.push({
    url: localUrl,
    width: image.size.width,
    height: image.size.height,
    relationship: image.relationship,
    wordFile: `${baseName}-image${index + 1}${extension}`,
    previous: image.previous,
    text: image.text
  });
}

fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
fs.writeFileSync(markdownPath, markdown);
const layout = fs.existsSync(layoutPath) ? JSON.parse(fs.readFileSync(layoutPath, 'utf8')) : {};
layout[layoutKeyArg || title] = layouts;
fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2) + '\n');

console.log(`已处理：${baseName}`);
console.log(`Markdown：${path.relative(root, markdownPath)}`);
console.log(`图片：${images.length} 张`);
console.log(`布局：${layoutKeyArg || title}`);
console.log(`尺寸：已从 DOCX 图片显示尺寸读取，单位为像素`);
