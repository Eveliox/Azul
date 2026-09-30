-- Leads from the free report at azulwebdev.com/free-report.
-- Run once in the Supabase SQL editor (the same project Review Booster uses is fine).

create table if not exists free_report_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  language text not null default 'en',
  consent boolean not null,
  business text not null,
  city text,
  trade text,
  website text,
  score int,
  report jsonb not null
);

create index if not exists free_report_leads_created_at on free_report_leads (created_at desc);

-- No policies: only the server (service role key) can read or write.
alter table free_report_leads enable row level security;
