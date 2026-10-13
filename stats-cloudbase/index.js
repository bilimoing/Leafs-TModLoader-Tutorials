const {Pool}=require('pg');
const {createTracker}=require('./tracker');
const {createServer}=require('./server');
if(!process.env.DATABASE_URL)throw new Error('请配置服务端 DATABASE_URL 环境变量');
// TLS 使用连接串 sslmode 或平台提供的证书，保留证书校验。
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:5000,idleTimeoutMillis:30000,query_timeout:10000,statement_timeout:10000});
pool.on('error',error=>console.error('数据库连接失败',error.code||'unknown'));
const server=createServer(createTracker(pool),process.env.ALLOWED_ORIGIN||'https://bilimoing.github.io');
server.listen(9000,'0.0.0.0',()=>console.log('PostgreSQL 统计服务已启动'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>pool.end().finally(()=>process.exit(0))));
