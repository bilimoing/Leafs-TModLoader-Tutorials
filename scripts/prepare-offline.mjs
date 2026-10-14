import fs from 'node:fs';
import path from 'node:path';
const source = path.resolve(process.argv[2] || 'release/wwwroot');
const output = path.resolve('offline-app/site');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true, filter: name => !/\.(br|gz|pdb)$/.test(name) });
const entry = path.join(output, 'index.html');
let html = fs.readFileSync(entry, 'utf8');
html = html.replace(/<base\s+[^>]*>/, '<base href="/" />');
html = html.replace('<head>', '<head><script>window.LEAF_OFFLINE=true;</script>');
fs.writeFileSync(entry, html);
const externalImages = fs.readdirSync('Pages/MD').filter(n => n.endsWith('.md')).flatMap(n => [...fs.readFileSync(path.join('Pages/MD', n), 'utf8').matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)].map(m => ({ article: n, url: m[1] })));
if (externalImages.length) throw new Error('仍有远程教程图片，不能声明完整离线：' + JSON.stringify(externalImages));
fs.writeFileSync(path.join(output, 'offline-version.json'), JSON.stringify({ builtAt: new Date().toISOString() }));
const androidOutput = path.resolve('offline-app/android-site');
fs.rmSync(androidOutput, { recursive: true, force: true });
fs.mkdirSync(androidOutput, { recursive: true });
const mapping = {};
function mapAssets(directory, prefix = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) mapAssets(path.join(directory, entry.name), relative + '/');
    else {
      const name = 'asset-' + Object.keys(mapping).length + path.extname(entry.name);
      mapping[relative] = name;
      fs.copyFileSync(path.join(directory, entry.name), path.join(androidOutput, name));
    }
  }
}
mapAssets(output);
fs.writeFileSync(path.join(androidOutput, 'asset-map.json'), JSON.stringify(mapping));
console.log('离线网站已生成，教程远程图片检查通过，Android 资源已映射为英文文件名');
