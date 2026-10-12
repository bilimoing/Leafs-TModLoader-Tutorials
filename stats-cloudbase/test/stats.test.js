const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createTracker}=require('../tracker');
const {createServer}=require('../server');
function database() {
  const records=new Map();let queue=Promise.resolve();
  const collection=name=>({doc:id=>({get:async()=>({data:records.get(name+id)||null}),set:async data=>{records.set(name+id,data);return {};}}),where:filter=>({count:async()=>({total:[...records].filter(([key,value])=>key.startsWith(name)&&value.lastSeen>=filter.lastSeen).length})})});
  return {records,collection,command:{gte:value=>value},runTransaction:callback=>{const next=queue.then(()=>callback({collection}));queue=next.catch(()=>{});return next;}};
}
const a='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
test('首次访问、重试去重、切换文章及在线过期',async()=>{
  const db=database(),track=createTracker(db);
  assert.deepEqual(await track({session:a,event:a,page:'首页'}),{online:1,visits:1,pageVisits:1});
  const retries=await Promise.all([track({session:a,event:a,page:'首页'}),track({session:a,event:a,page:'首页'})]);
  assert.equal(retries[0].visits,1);assert.equal(retries[1].visits,1);
  assert.deepEqual(await track({session:a,event:b,page:'文章'}),{online:1,visits:2,pageVisits:1});
  assert.deepEqual(await track({session:b,event:a,page:'首页'}),{online:2,visits:3,pageVisits:2});
  db.records.get('stats_sessions'+a).lastSeen=Date.now()-100000;
  assert.deepEqual(await track({session:b,event:a,page:'首页'}),{online:1,visits:3,pageVisits:2});
});
test('健康检查、来源限制、预检、无效输入及后端失败',async t=>{
  const origin='https://bilimoing.github.io';let fail=false;
  const server=createServer(async()=>{if(fail)throw new Error('模拟数据库错误');return {online:1,visits:1,pageVisits:1};},origin);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>{server.closeAllConnections();server.close();});
  const url='http://127.0.0.1:'+server.address().port;
  assert.equal((await fetch(url+'/health')).status,200);
  assert.equal((await fetch(url)).status,403);
  const pre=await fetch(url,{method:'OPTIONS',headers:{Origin:origin}});
  assert.equal(pre.status,204);assert.equal(pre.headers.get('access-control-allow-origin'),origin);
  const send=body=>fetch(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await send(null)).status,400);
  assert.equal((await send({session:a,event:a,page:'首页'})).status,200);
  fail=true;assert.equal((await send({session:a,event:a,page:'首页'})).status,503);
});
