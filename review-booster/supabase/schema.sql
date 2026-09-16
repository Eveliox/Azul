-- Azul Review Booster — run this in Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- One row per business you manage (HelloYou Wellness, Aspire Roofing, ...)
create table if not exists clients (
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

-- One row per review request sent to a customer
create table if not exists review_requests (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references clients(id) on delete cascade,
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

create index if not exists review_requests_due_idx
  on review_requests (status, send_at);
create index if not exists review_requests_client_idx
  on review_requests (client_id, created_at desc);

-- Per-client stats used by the admin dashboard
create or replace view client_stats as
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
  round(avg(r.rating)::numeric, 2)                     as avg_rating
from clients c
left join review_requests r on r.client_id = c.id
group by c.id;

-- Lock everything down: the browser never talks to Supabase directly.
-- All access goes through the Vercel API using the service-role key.
alter table clients enable row level security;
alter table review_requests enable row level security;

-- Seed: Hello You Wellness (edit the Google URL + owner details, then run)
insert into clients (name, slug, google_review_url, owner_name, owner_email, default_language)
values (
  'Hello You Wellness Center',
  'helloyou',
  'https://search.google.com/local/writereview?placeid=REPLACE_ME',
  'Owner Name',
  'owner@helloyouwellness.com',
  'en'
)
on conflict (slug) do nothing;
