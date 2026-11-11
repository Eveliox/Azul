-- Speed-to-lead agent, part 5: call costs, scheduled emails, owner controls, hosted lead form.
-- Run after 20261113_speed_to_lead_calendar.sql. Additive and safe to re-run.
begin;

-- What each call cost (from Vapi's end-of-call report), for Azul's margin per client.
alter table public.rb_lead_calls add column if not exists cost_usd numeric(10,4);

-- Owner's weekly results email, and the hosted lead form at /f/<slug>.
alter table public.rb_lead_agents add column if not exists weekly_email boolean not null default true;
alter table public.rb_lead_agents add column if not exists hosted_form boolean not null default false;
alter table public.rb_lead_agents add column if not exists privacy_url text;
alter table public.rb_lead_agents drop constraint if exists rb_lead_agents_privacy_url_check;
alter table public.rb_lead_agents add constraint rb_lead_agents_privacy_url_check check (privacy_url is null or (privacy_url ~ '^https://' and length(privacy_url) <= 300));

-- Once-a-day / once-a-week jobs run from the 5-minute retry tick. One row per job.
create table if not exists public.rb_lead_jobs (
  name text primary key,
  last_run_at timestamptz not null
);
-- Claims a job if it hasn't run since p_after. True for exactly one caller.
create or replace function public.rb_claim_job(p_name text, p_after timestamptz)
returns boolean language plpgsql set search_path = public as $$
declare v boolean;
begin
  insert into rb_lead_jobs(name, last_run_at) values (p_name, now())
    on conflict (name) do update set last_run_at = now() where rb_lead_jobs.last_run_at < p_after
    returning true into v;
  return coalesce(v, false);
end $$;

-- Same as before, plus the call's cost.
create or replace function public.rb_record_call_result(p_call_id text, p_result jsonb)
returns setof public.rb_leads language plpgsql set search_path = public as $$
declare c rb_lead_calls; r rb_leads; v_status text := p_result->>'status';
begin
  if v_status not in ('retry','booked','handed_off','needs_owner','stopped','no_answer') then raise exception 'Invalid call status'; end if;
  select * into c from rb_lead_calls where call_id = p_call_id for update;
  if not found or c.ended_at is not null then return; end if;
  update rb_lead_calls set ended_at = now(), ended_reason = left(p_result->>'ended_reason', 100),
    cost_usd = case when (p_result->>'cost') ~ '^[0-9]+(\.[0-9]+)?$' then least((p_result->>'cost')::numeric, 999999) end
    where call_id = p_call_id;
  select * into r from rb_leads where id = c.lead_id for update;
  if coalesce((p_result->>'do_not_call')::boolean, false) then
    insert into rb_do_not_contact(client_id, phone, reason) values (r.client_id, r.phone, 'Asked on a call') on conflict do nothing;
  end if;
  if r.current_call_id is distinct from p_call_id then return; end if;
  if r.status <> 'calling' and not (r.status = 'needs_owner' and v_status in ('booked','stopped')) then return; end if;
  return query update rb_leads set status = v_status,
    next_attempt_at = case when v_status = 'retry' then coalesce((p_result->>'next_attempt_at')::timestamptz, now() + interval '2 hours') end,
    ended_reason = left(p_result->>'ended_reason', 100),
    booked = booked or coalesce((p_result->>'booked')::boolean, false),
    appointment_time = coalesce(left(nullif(p_result->>'appointment_time',''), 100), appointment_time),
    summary = coalesce(left(nullif(p_result->>'summary',''), 4000), summary),
    updated_at = now()
    where id = r.id returning *;
end $$;

-- Same as before, plus the call's cost.
create or replace function public.rb_record_inbound_call(p_call_id text, p_client uuid, p_phone text, p_result jsonb)
returns jsonb language plpgsql set search_path = public as $$
declare r rb_leads; u rb_leads; v_booked boolean := coalesce((p_result->>'booked')::boolean, false);
  v_dnc boolean := coalesce((p_result->>'do_not_call')::boolean, false); v_rows integer;
begin
  select * into r from rb_leads where client_id = p_client and phone = p_phone order by received_at desc limit 1 for update;
  insert into rb_lead_calls(call_id, lead_id, client_id, kind, phone, summary, ended_at, ended_reason, cost_usd)
    values (p_call_id, r.id, p_client, 'inbound', p_phone, left(p_result->>'summary', 4000), now(), left(p_result->>'ended_reason', 100),
      case when (p_result->>'cost') ~ '^[0-9]+(\.[0-9]+)?$' then least((p_result->>'cost')::numeric, 999999) end)
    on conflict (call_id) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then return jsonb_build_object('recorded', false, 'lead', null); end if;
  if v_dnc and p_phone ~ '^\+1[2-9][0-9]{9}$' then
    insert into rb_do_not_contact(client_id, phone, reason) values (p_client, p_phone, 'Asked on a callback') on conflict do nothing;
  end if;
  if r.id is null then return jsonb_build_object('recorded', true, 'lead', null); end if;
  if v_booked or v_dnc or r.status in ('retry','no_answer','failed','not_called') then
    update rb_leads set
      status = case when v_booked then 'booked' when v_dnc then 'stopped' else 'needs_owner' end,
      booked = booked or v_booked,
      appointment_time = case when v_booked then coalesce(left(nullif(p_result->>'appointment_time',''), 100), appointment_time) else appointment_time end,
      summary = coalesce(left(nullif(p_result->>'summary',''), 4000), summary),
      notes = 'They called back',
      next_attempt_at = null, lease_token = null, lease_until = null, updated_at = now()
      where id = r.id and status not in ('dialing','calling','owner_ringing','owner_connecting')
      returning * into u;
    if found then r := u; end if;
  end if;
  return jsonb_build_object('recorded', true, 'lead', to_jsonb(r));
end $$;

do $$ declare f record; begin
  execute 'alter table public.rb_lead_jobs enable row level security';
  execute 'revoke all on public.rb_lead_jobs from public, anon, authenticated';
  execute 'grant all on public.rb_lead_jobs to service_role';
  for f in select oid::regprocedure as sig from pg_proc where pronamespace = 'public'::regnamespace
    and proname in ('rb_claim_job','rb_record_call_result','rb_record_inbound_call') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
