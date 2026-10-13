-- 使用管理员执行；不授权匿名或浏览器角色。
CREATE OR REPLACE FUNCTION public.leaf_stats_heartbeat(p_session uuid,p_event uuid,p_page text)
RETURNS TABLE(online bigint,visits bigint,page_visits bigint)
LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
DECLARE v_fresh integer; v_now timestamptz;
BEGIN
 IF p_session IS NULL OR p_event IS NULL OR p_page IS NULL OR char_length(p_page)<1 OR char_length(p_page)>200 THEN
 RAISE EXCEPTION 'Invalid statistics input'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_session::text,0));
 v_now:=clock_timestamp();
 INSERT INTO public.leaf_stats_sessions(session_id,last_seen) VALUES(p_session,v_now) ON CONFLICT(session_id) DO UPDATE SET last_seen=EXCLUDED.last_seen;
 INSERT INTO public.leaf_stats_events(session_id,event_id,created_at) VALUES(p_session,p_event,v_now) ON CONFLICT DO NOTHING;
 GET DIAGNOSTICS v_fresh=ROW_COUNT;
 IF v_fresh=1 THEN
 UPDATE public.leaf_stats_totals SET visits=leaf_stats_totals.visits+1 WHERE id=1;
 IF NOT FOUND THEN RAISE EXCEPTION 'Missing total counter'; END IF;
 INSERT INTO public.leaf_stats_pages(page,visits) VALUES(p_page,1) ON CONFLICT(page) DO UPDATE SET visits=leaf_stats_pages.visits+1;
 END IF;
 RETURN QUERY SELECT (SELECT count(*) FROM public.leaf_stats_sessions WHERE last_seen>=v_now-interval '90 seconds'),(SELECT t.visits FROM public.leaf_stats_totals t WHERE t.id=1),COALESCE((SELECT p.visits FROM public.leaf_stats_pages p WHERE p.page=p_page),0::bigint);
END; $$;
REVOKE ALL ON FUNCTION public.leaf_stats_heartbeat(uuid,uuid,text) FROM PUBLIC;

-- 每天在控制台定时任务或管理员手动执行下面的清理语句（取消注释）。
-- 仅删除七天未活动的会话及事件，累计计数不变。清理后的旧事件再次上报可能重新计数。
-- DELETE FROM public.leaf_stats_events e USING public.leaf_stats_sessions s WHERE e.session_id=s.session_id AND s.last_seen<now()-interval '7 days';
-- DELETE FROM public.leaf_stats_sessions WHERE last_seen<now()-interval '7 days';
