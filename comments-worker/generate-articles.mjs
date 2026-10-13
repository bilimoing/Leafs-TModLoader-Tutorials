import fs from 'node:fs';
const titles = fs.readdirSync(new URL('../Pages/MD/', import.meta.url)).filter(n => n.endsWith('.md')).map(n => n.slice(0, -3));
fs.writeFileSync(new URL('articles.mjs', import.meta.url), 'export default ' + JSON.stringify(titles, null, 2) + ';\n');
console.log('已生成服务端教程清单');
