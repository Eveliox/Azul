-- Azul Review Booster — run this in Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────
-- Tables are prefixed rb_ so this can live alongside other apps in a shared project.
-- Safe to re-run.

create extension if not exists "pgcrypto";

-- One row per business you manage (HelloYou Wellness, Aspire Roofing, ...)
create table if not exists rb_clients (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,                  -- "Hello You Wellness Center"
  slug              text not null unique,           -- "helloyou"
  google_review_url text not null,                  -- https://g.page/r/XXXX/review
  owner_name        text,
  owner_email       text,                           -- gets private feedback + weekly stats
  owner_phone       text,                           -- E.164, optional: SMS alert on low rating
  default_language  text not null default 'en' check (default_language in ('en','es')),
  delay_hours       int  not null default 3,        -- wait after job complete before asking
  followup_hours    int  not null default 48,       -- one nudge if no click
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- Per-business front-desk login. Each business only sees its own data.
alter table rb_clients
  add column if not exists access_key text not null unique default encode(gen_random_bytes(24), 'hex');

-- Message tone for every SMS/email this client sends.
alter table rb_clients
  add column if not exists tone text not null default 'friendly'
  check (tone in ('friendly','professional','casual','warm'));
-- Owner's edits to the message text (null = use the preset as-is).
alter table rb_clients add column if not exists messages jsonb;

-- Which Azul services this business is paying for. Controls what their access key can see.
-- Set by the agency (master key) only; clients cannot change it themselves.
alter table rb_clients
  add column if not exists services text[] not null default '{reviews}';
alter table rb_clients drop constraint if exists rb_clients_services_check;
alter table rb_clients
  add constraint rb_clients_services_check
  check (services <@ array['website','calls','reviews','seo','social']::text[]);
-- Website/voice/SEO-only clients have no review link. Review requests are refused for them.
alter table rb_clients alter column google_review_url drop not null;

-- One row per review request sent to a customer
create table if not exists rb_review_requests (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references rb_clients(id) on delete cascade,
  token           text not null unique,             -- short id used in the public link
  customer_name   text not null,
  customer_phone  text,                             -- E.164
  customer_email  text,
  language        text not null default 'en' check (language in ('en','es')),
  status          text not null default 'pending'
                  check (status in ('pending','sent','clicked','rated','failed','cancelled')),
  send_at         timestamptz not null,             -- when the first message goes out
  sent_at         timestamptz,
  followup_sent_at timestamptz,
  clicked_at      timestamptz,
  rating          int check (rating between 1 and 5),
  feedback        text,                             -- private feedback for 1-4 stars
  rated_at        timestamptz,
  error           text,
  created_at      timestamptz not null default now()
);

create index if not exists rb_review_requests_due_idx
  on rb_review_requests (status, send_at);
create index if not exists rb_review_requests_client_idx
  on rb_review_requests (client_id, created_at desc);

-- Per-client stats used by the admin dashboard.
-- security_invoker makes the view obey the tables' RLS instead of bypassing it.
-- Dropped first: Postgres can't add columns to an existing view in place.
drop view if exists rb_client_stats;
create view rb_client_stats
with (security_invoker = true) as
select
  c.id as client_id,
  c.name,
  c.slug,
  count(r.id)                                          as total,
  count(r.id) filter (where r.status = 'pending')      as pending,
  count(r.id) filter (where r.sent_at is not null)     as sent,
  count(r.id) filter (where r.clicked_at is not null)  as clicked,
  count(r.id) filter (where r.rating is not null)      as rated,
  count(r.id) filter (where r.rating = 5)              as five_star,
  count(r.id) filter (where r.rating between 1 and 4)  as shielded,
  round(avg(r.rating)::numeric, 2)                     as avg_rating,
  c.tone,
  c.access_key,
  c.services,
  c.owner_name,
  c.owner_email,
  c.delay_hours,
  c.followup_hours,
  c.default_language
from rb_clients c
left join rb_review_requests r on r.client_id = c.id
group by c.id;

-- Lock everything down: the browser never talks to Supabase directly.
-- All access goes through the Vercel API using the service-role key.
-- This matters in a shared project, whose public anon key may be shipped in another app's frontend.
alter table rb_clients enable row level security;
alter table rb_review_requests enable row level security;
revoke all on rb_clients, rb_review_requests, rb_client_stats from anon, authenticated;

-- Seed: Hello You Wellness (edit the Google URL + owner details later in Table Editor)
insert into rb_clients (name, slug, google_review_url, owner_name, owner_email, default_language, services)
values (
  'Hello You Wellness Center',
  'helloyou',
  'https://search.google.com/local/writereview?placeid=REPLACE_ME',
  'Owner Name',
  'owner@helloyouwellness.com',
  'en',
  '{reviews,seo}'
)
on conflict (slug) do nothing;
