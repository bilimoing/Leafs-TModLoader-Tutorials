import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||'import/export');
if(!fs.existsSync(root))throw Error('请先将带图片的 Markdown 导出包解压到 import/export');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(function(entry){const file=path.join(dir,entry.name);return entry.isDirectory()?walk(file):[file];});}
const files=walk(root).filter(function(file){return file.endsWith('.md');});
const matches=function(text){return [...text.matchAll(/!\[[^\]]*\]\(([^\r\n]*?)\)/g)];};
let imported=0;
for(const file of files){const target=path.join('Pages/MD',path.basename(file));if(!fs.existsSync(target)){console.log('跳过无同名教程：'+path.basename(file));continue;}const exported=fs.readFileSync(file,'utf8'),original=fs.readFileSync(target,'utf8');const incoming=matches(exported),existing=matches(original);if(!incoming.length||incoming.length!==existing.length){console.log('跳过图片数量不一致：'+path.basename(file));continue;}const replacements=[];let valid=true;for(let i=0;i<incoming.length;i++){let url=incoming[i][1].trim();if(url.startsWith('http:')||url.startsWith('https:')){valid=false;break;}url=url.replace(/^</,'').replace(/>$/,'');const input=path.resolve(path.dirname(file),decodeURIComponent(url));if(!input.startsWith(root+path.sep)||!fs.existsSync(input)){valid=false;break;}const bytes=fs.readFileSync(input);let ext='';if(bytes[0]===137&&bytes[1]===80)ext='png';else if(bytes[0]===255&&bytes[1]===216)ext='jpg';else if(bytes[0]===71&&bytes[1]===73)ext='gif';else if(bytes[0]===82&&bytes[1]===73&&bytes.subarray(8,12).toString()==='WEBP')ext='webp';if(!ext){valid=false;break;}const name=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,24)+'.'+ext;replacements.push({bytes,name,url:existing[i][1]});}if(!valid){console.log('跳过缺少本地图片的导出文档：'+path.basename(file));continue;}fs.mkdirSync('wwwroot/images/tutorials',{recursive:true});let updated=original;for(const item of replacements){fs.writeFileSync('wwwroot/images/tutorials/'+item.name,item.bytes);updated=updated.split(item.url).join('images/tutorials/'+item.name);imported++;}fs.writeFileSync(target,updated);console.log('已导入：'+path.basename(file));}
console.log('已导入图片引用：'+imported);
if(!imported)process.exitCode=1;
