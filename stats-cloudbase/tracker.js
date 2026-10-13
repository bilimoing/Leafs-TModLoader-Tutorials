function validate(data) {
 const id=value=>typeof value==='string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
 return Boolean(data && id(data.session) && id(data.event) && typeof data.page==='string' && data.page.length>0 && data.page.length<=200);
}
function createTracker(db) {
 return async function heartbeat(data) {
 const result=await db.query('SELECT online, visits, page_visits FROM public.leaf_stats_heartbeat($1::uuid,$2::uuid,$3::text)',[data.session,data.event,data.page]);
 const row=result.rows[0];
 if(!row) throw new Error('统计函数未返回结果');
 const count=value=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<0)throw new Error('统计值超出安全范围');return n;};
 return {online:count(row.online),visits:count(row.visits),pageVisits:count(row.page_visits)};
 };
}
module.exports={createTracker,validate};
