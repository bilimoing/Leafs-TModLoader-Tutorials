const ALLOWED_ORIGIN = 'https://bilimoing.github.io';
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin !== ALLOWED_ORIGIN) return new Response('禁止来源', {status:403});
    const headers = {'Access-Control-Allow-Origin':origin, 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store', Vary:'Origin'};
    if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
    if (request.method !== 'POST') return new Response('只接受心跳', {status:405, headers});
    let data;
    try {data = await request.json();} catch {return new Response('无效请求', {status:400, headers});}
    const validId = value => typeof value === 'string' && /^[a-f0-9-]{36}$/.test(value);
    if (!data || !validId(data.session) || !validId(data.event) || typeof data.page !== 'string' || data.page.length > 200) return new Response('无效参数', {status:400, headers});
    if (!env.DB) return new Response('请绑定 D1 数据库，变量名称为 DB', {status:503, headers});
    const now = Date.now();
    try {
      const db = env.DB.withSession('first-primary');
      const increment = 'INSERT INTO counters(name, visits) SELECT ?, 1 WHERE NOT EXISTS (SELECT 1 FROM sessions WHERE id = ? AND event = ?) ON CONFLICT(name) DO UPDATE SET visits = visits + 1';
      const results = await db.batch([
        db.prepare(increment).bind('total', data.session, data.event),
        db.prepare(increment).bind('page:' + data.page, data.session, data.event),
        db.prepare('DELETE FROM sessions WHERE last_seen < ?').bind(now - 90000),
        db.prepare('INSERT INTO sessions(id, event, last_seen) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET event = excluded.event, last_seen = excluded.last_seen').bind(data.session, data.event, now),
        db.prepare('SELECT COUNT(*) AS online FROM sessions'),
        db.prepare('SELECT COALESCE((SELECT visits FROM counters WHERE name = ?), 0) AS visits, COALESCE((SELECT visits FROM counters WHERE name = ?), 0) AS pageVisits').bind('total', 'page:' + data.page)
      ]);
      return Response.json({online:results[4].results[0].online, visits:results[5].results[0].visits, pageVisits:results[5].results[0].pageVisits}, {headers});
    } catch (error) {
      console.error('统计数据库错误', error);
      return new Response('统计数据库暂不可用，请检查建表语句', {status:503, headers});
    }
  }
};
