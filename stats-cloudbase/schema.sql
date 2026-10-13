-- 先执行本文件，再执行 rpc.sql；重复执行不会清空计数。
CREATE TABLE IF NOT EXISTS public.leaf_stats_totals (id integer PRIMARY KEY CHECK (id=1), visits bigint NOT NULL DEFAULT 0 CHECK (visits>=0));
INSERT INTO public.leaf_stats_totals(id) VALUES(1) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS public.leaf_stats_pages(page text PRIMARY KEY, visits bigint NOT NULL DEFAULT 0 CHECK(visits>=0));
CREATE TABLE IF NOT EXISTS public.leaf_stats_sessions(session_id uuid PRIMARY KEY, last_seen timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS leaf_stats_sessions_last_seen ON public.leaf_stats_sessions(last_seen);
CREATE TABLE IF NOT EXISTS public.leaf_stats_events(session_id uuid NOT NULL, event_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(session_id,event_id));
ALTER TABLE public.leaf_stats_totals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaf_stats_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaf_stats_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaf_stats_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leaf_stats_totals,public.leaf_stats_pages,public.leaf_stats_sessions,public.leaf_stats_events FROM PUBLIC;
