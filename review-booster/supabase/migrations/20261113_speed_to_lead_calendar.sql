-- Speed-to-lead agent, part 4: the business's Google Calendar ID, so Azul-built assistants create
-- their calendar tools on each call (no per-business tools to duplicate in Vapi).
-- Run after 20261112_speed_to_lead_profiles.sql. Additive and safe to re-run.
begin;
alter table public.rb_lead_agents add column if not exists calendar_id text;
alter table public.rb_lead_agents drop constraint if exists rb_lead_agents_calendar_id_check;
alter table public.rb_lead_agents add constraint rb_lead_agents_calendar_id_check
  check (calendar_id is null or calendar_id ~ '^[A-Za-z0-9._%+-]{1,150}@[A-Za-z0-9.-]{3,100}$');
commit;
