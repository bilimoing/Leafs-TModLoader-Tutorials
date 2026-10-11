import fs from 'node:fs';
import path from 'node:path';
const source=process.argv[2]||'import/images';
const entries=JSON.parse(fs.readFileSync('scripts/image-migration/images.json','utf8'));
const mapped=new Map();
fs.mkdirSync('wwwroot/images/tutorials',{recursive:true});
for(const item of entries){const input=path.join(source,item.file);if(!fs.existsSync(input))continue;const bytes=fs.readFileSync(input);let extension='';if(bytes[0]===137&&bytes[1]===80)extension='png';else if(bytes[0]===255&&bytes[1]===216)extension='jpg';else if(bytes[0]===71&&bytes[1]===73)extension='gif';else if(bytes[0]===82&&bytes[1]===73)extension='webp';if(!extension)continue;const file=item.file.replace('.img','.'+extension);fs.copyFileSync(input,'wwwroot/images/tutorials/'+file);mapped.set(item.url,'images/tutorials/'+file);}
for(const name of fs.readdirSync('Pages/MD')){const file='Pages/MD/'+name;let text=fs.readFileSync(file,'utf8');let changed=false;for(const [url,local] of mapped){if(text.includes(url)){text=text.split(url).join(local);changed=true;}}if(changed)fs.writeFileSync(file,text);}
console.log('成功导入图片：'+mapped.size+' / '+entries.length);
if(mapped.size===0)process.exitCode=1;
