const cloudbase=require('@cloudbase/node-sdk');
const {createTracker}=require('./tracker');
const {createServer}=require('./server');
const env=process.env.CLOUDBASE_ENV_ID;
if(!env) throw new Error('请配置 CLOUDBASE_ENV_ID 环境变量');
const app=cloudbase.init({env});
const server=createServer(createTracker(app.database()),process.env.ALLOWED_ORIGIN||'https://bilimoing.github.io');
server.listen(9000,'0.0.0.0',()=>console.log('统计服务已启动'));
