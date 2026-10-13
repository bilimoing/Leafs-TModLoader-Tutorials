const http=require('node:http');
const {validate}=require('./tracker');
function createServer(track,allowedOrigin){
 return http.createServer(async(req,res)=>{
 const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
 res.setHeader('Cache-Control','no-store');
 if(req.method==='GET' && req.url.split('?')[0]==='/health')return send(200,{status:'ok',service:'leaf-cloudbase-stats'});
 if(req.headers.origin!==allowedOrigin)return send(403,{error:'禁止来源'});
 res.setHeader('Access-Control-Allow-Origin',allowedOrigin);res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 if(req.method!=='POST')return send(405,{error:'只接受心跳'});
 try{
 const chunks=[];let size=0;
 for await(const chunk of req){size+=chunk.length;if(size>4096)return send(413,{error:'请求过大'});chunks.push(chunk);}
 let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return send(400,{error:'无效请求'});}
 if(!validate(data))return send(400,{error:'无效参数'});
 return send(200,await track(data));
 }catch(error){
 console.error('统计请求失败',error.code||'unknown');
 return send(503,{error:'统计数据库暂不可用，请检查连接、建表脚本与权限'});
 }
 });
}
module.exports={createServer};
