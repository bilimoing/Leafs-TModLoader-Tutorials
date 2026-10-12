const {createHash} = require('node:crypto');
function checked(value) { if(value.code) throw Object.assign(new Error(value.message || value.code),value); return value; }
function doc(value) { const data=checked(value).data; return Array.isArray(data)?data[0]:data; }
function validate(data) {
  const id=value=>typeof value==='string' && /^[a-f0-9-]{36}$/.test(value);
  return data && id(data.session) && id(data.event) && typeof data.page==='string' && data.page.length>0 && data.page.length<=200;
}
function createTracker(db) {
  return async function heartbeat(data) {
    const now=Date.now();
    const pageId=createHash('sha256').update(data.page).digest('hex');
    const counts=await db.runTransaction(async tx=>{
      const sessionRef=tx.collection('stats_sessions').doc(data.session);
      const totalRef=tx.collection('stats_counters').doc('total');
      const pageRef=tx.collection('stats_pages').doc(pageId);
      const previous=doc(await sessionRef.get());
      const total=doc(await totalRef.get());
      const page=doc(await pageRef.get());
      const fresh=!previous || previous.event!==data.event;
      const visits=(total?.visits||0)+(fresh?1:0);
      const pageVisits=(page?.visits||0)+(fresh?1:0);
      if(fresh) {
        checked(await totalRef.set({visits}));
        checked(await pageRef.set({page:data.page,visits:pageVisits}));
      }
      checked(await sessionRef.set({event:data.event,lastSeen:now,expiresAt:new Date(now+86400000)}));
      return {visits,pageVisits};
    });
    const result=counts.result || counts;
    const active=checked(await db.collection('stats_sessions').where({lastSeen:db.command.gte(now-90000)}).count());
    return {online:active.total,visits:result.visits,pageVisits:result.pageVisits};
  };
}
module.exports={createTracker,validate};
