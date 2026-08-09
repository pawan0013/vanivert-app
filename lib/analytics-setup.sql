-- ── VANIVERT ANALYTICS TABLES ─────────────────────────────────────────────────
-- Run this once in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- Page views
create table if not exists analytics_pageviews (
  id          bigserial primary key,
  session_id  text not null,
  path        text not null,
  referrer    text,
  device      text,
  country     text,
  ts          timestamptz not null default now()
);

-- Section engagement (time spent per section)
create table if not exists analytics_sections (
  id            bigserial primary key,
  session_id    text not null,
  section_id    text not null,
  section_label text,
  duration_ms   int,
  ts            timestamptz not null default now()
);

-- CTA clicks
create table if not exists analytics_cta (
  id          bigserial primary key,
  session_id  text not null,
  label       text not null,
  destination text,
  ts          timestamptz not null default now()
);

-- Scroll depth milestones
create table if not exists analytics_scroll (
  id          bigserial primary key,
  session_id  text not null,
  depth_pct   int not null,
  ts          timestamptz not null default now()
);

-- Enable Row Level Security (public insert only — anon key can write but not read)
alter table analytics_pageviews enable row level security;
alter table analytics_sections  enable row level security;
alter table analytics_cta       enable row level security;
alter table analytics_scroll    enable row level security;

-- Allow anon inserts (tracking from the browser)
create policy "anon insert pageviews"  on analytics_pageviews  for insert to anon with check (true);
create policy "anon insert sections"   on analytics_sections   for insert to anon with check (true);
create policy "anon insert cta"        on analytics_cta        for insert to anon with check (true);
create policy "anon insert scroll"     on analytics_scroll     for insert to anon with check (true);

-- Allow service_role to SELECT (admin reads)
create policy "service read pageviews" on analytics_pageviews  for select to service_role using (true);
create policy "service read sections"  on analytics_sections   for select to service_role using (true);
create policy "service read cta"       on analytics_cta        for select to service_role using (true);
create policy "service read scroll"    on analytics_scroll     for select to service_role using (true);

-- Indexes for fast queries
create index if not exists idx_pv_ts        on analytics_pageviews (ts desc);
create index if not exists idx_sec_ts       on analytics_sections  (ts desc);
create index if not exists idx_sec_section  on analytics_sections  (section_id);
create index if not exists idx_cta_ts       on analytics_cta       (ts desc);
