const fs = require('node:fs');
const cp = require('node:child_process');
const path = require('node:path');
const crypto = require('node:crypto');

const docx = 'C:/Users/32387/Downloads/中学生：基础城镇NPC.docx';
const readZipEntry = (entry, binary = false) => cp.execFileSync('tar', ['-xOf', docx, entry], binary ? { maxBuffer: 50 * 1024 * 1024 } : { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
const xml = readZipEntry('word/document.xml');
const relsXml = readZipEntry('word/_rels/document.xml.rels');
const relations = new Map();
for (const match of relsXml.matchAll(/<Relationship\s+([^>]+?)\s*\/?\s*>/g)) {
  const attrs = Object.fromEntries([...match[1].matchAll(/([\w:]+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]));
  relations.set(attrs.Id, attrs.Target);
}
const paragraphs = [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((match) => match[0]);
const images = [];
for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
  const paragraph = paragraphs[paragraphIndex];
  const ids = [...paragraph.matchAll(/r:embed="([^"]+)"/g)].map((match) => match[1]);
  for (const id of ids) {
    const target = relations.get(id);
    if (!target || !target.includes('media/')) continue;
    const text = paragraph.replace(/<w:tab[^>]*\/>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/\s+/g, ' ').trim();
    const previous = paragraphs.slice(0, paragraphIndex).map((p) => p.replace(/<[^>]+>/g, ' ').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/\s+/g, ' ').trim()).filter(Boolean).at(-1) || '';
    images.push({ target: `word/${target.replace(/^\.\//, '')}`, relationship: id, text, previous });
  }
}
const markdownPath = 'Pages/MD/中学生：基础城镇NPC.md';
let markdown = fs.readFileSync(markdownPath, 'utf8');
const oldImages = [...markdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
const mediaEntries = cp.execFileSync('tar', ['-tf', docx], { encoding: 'utf8' }).split(/\r?\n/).filter((name) => /^word\/media\//.test(name));
if (images.length !== mediaEntries.length) throw new Error(`图片关系数量不一致：关系 ${images.length}，媒体 ${mediaEntries.length}`);
if (oldImages.length > images.length) throw new Error(`Markdown 图片数量 ${oldImages.length} 超出 DOCX 图片数量 ${images.length}，拒绝自动错位替换`);

const outputDir = 'wwwroot/images/tutorials';
fs.mkdirSync(outputDir, { recursive: true });
const layouts = [];
for (let i = 0; i < images.length; i++) {
  const image = images[i];
  const bytes = readZipEntry(image.target, true);
  const ext = path.extname(image.target).toLowerCase();
  const filename = `${crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 24)}${ext}`;
  fs.writeFileSync(path.join(outputDir, filename), bytes);
  const localUrl = `images/tutorials/${filename}`;
  if (oldImages[i]) {
    const original = oldImages[i][0];
    const alt = oldImages[i][1] || `教程配图 ${i + 1}`;
    markdown = markdown.replace(original, `![${alt}](${localUrl})`);
  } else {
    const anchor = image.previous ? markdown.indexOf(image.previous) : -1;
    const insertion = `\n\n![教程配图 ${i + 1}](${localUrl})\n`;
    if (anchor >= 0) {
      const lineEnd = markdown.indexOf('\n', anchor);
      markdown = markdown.slice(0, lineEnd < 0 ? markdown.length : lineEnd) + insertion + markdown.slice(lineEnd < 0 ? markdown.length : lineEnd);
    } else {
      markdown += insertion;
    }
  }
  layouts.push({ url: localUrl, width: 0, height: 0, relationship: image.relationship, wordFile: `${path.basename(docx, '.docx')}-image${i + 1}${ext}`, previous: image.previous, text: image.text });
}
fs.writeFileSync(markdownPath, markdown);
const layoutPath = 'Services/image-layout.json';
const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
layout['中学生：基础城镇NPC'] = layouts;
fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2) + '\n');
console.log(`完成：提取 ${images.length} 张图并更新 Markdown 和布局配置。`);
