-- Speed-to-lead agent: website lead → Vapi call → result, retries, do-not-contact.
-- Replaces the Make.com scenarios. Run after 20261008_agent_operations.sql.
-- Additive and safe to re-run. Existing tables are not changed.
begin;

-- One row per business using the agent (rb_clients with the 'calls' service).
create table if not exists public.rb_lead_agents (
  client_id uuid primary key references public.rb_clients(id) on delete cascade,
  mode text not null default 'testing' check (mode in ('testing','active','paused')),
  -- Secret the client's website server sends as x-lead-key. Never put it in browser code.
  form_key text not null unique default (replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','')),
  business_name text not null check (length(business_name) between 1 and 120),
  vapi_assistant_id text not null check (length(vapi_assistant_id) between 1 and 100),
  vapi_phone_number_id text not null check (length(vapi_phone_number_id) between 1 and 100),
  twilio_number text check (twilio_number ~ '^\+1[2-9][0-9]{9}$'),
  owner_email text not null check (length(owner_email) between 3 and 500),
  owner_cell text check (owner_cell ~ '^\+1[2-9][0-9]{9}$'),
  owner_first boolean not null default false,
  timezone text not null default 'America/New_York',
  call_start_hour integer not null default 8 check (call_start_hour between 0 and 23),
  call_end_hour integer not null default 20 check (call_end_hour between 1 and 24),
  call_sundays boolean not null default false,
  max_attempts integer not null default 3 check (max_attempts between 1 and 5),
  retry_gap_minutes integer not null default 120 check (retry_gap_minutes between 30 and 1440),
  -- In 'testing' mode only these numbers are ever called.
  test_numbers text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (call_end_hour > call_start_hour),
  check (not owner_first or (owner_cell is not null and twilio_number is not null))
);

-- One row per website lead (was the "Leads" sheet tab).
create table if not exists public.rb_leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  received_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 120),
  phone text not null check (phone ~ '^\+1[2-9][0-9]{9}$'),
  email text check (length(email) <= 254),
  address text check (length(address) <= 300),
  zip text check (length(zip) <= 20),
  service text check (length(service) <= 120),
  details text check (length(details) <= 2000),
  language text not null default 'en' check (language in ('en','es')),
  consent boolean not null default false,
  consent_text text check (length(consent_text) <= 1000),
  page_url text check (length(page_url) <= 500),
  extra jsonb not null default '{}',
  status text not null default 'new' check (status in (
    'new',              -- saved, not dialed yet
    'dialing',          -- a worker holds the lease and is placing the call
    'calling',          -- AI call placed, waiting for Vapi's end-of-call report
    'retry',            -- will be called again at next_attempt_at
    'owner_ringing','owner_connecting','owner_talked',  -- owner-first flow
    'booked','handed_off','needs_owner','stopped','no_answer','failed',
    'blocked',          -- on the do-not-contact list when it arrived
    'not_called'        -- no consent, agent paused/off, or testing mode
  )),
  attempts integer not null default 0,
  first_call_at timestamptz,
  last_attempt_at timestamptz,
  next_attempt_at timestamptz,
  current_call_id text,
  ended_reason text,
  booked boolean not null default false,
  appointment_time text,
  summary text,
  notes text,
  last_error text,
  lease_token uuid,
  lease_until timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists rb_leads_due_idx on public.rb_leads(status, next_attempt_at);
create index if not exists rb_leads_client_idx on public.rb_leads(client_id, received_at desc);
create index if not exists rb_leads_phone_idx on public.rb_leads(client_id, phone, received_at desc);

-- One row per call placed. The primary key makes Vapi's end-of-call report safe to receive twice.
create table if not exists public.rb_lead_calls (
  call_id text primary key,
  lead_id uuid not null references public.rb_leads(id) on delete cascade,
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  kind text not null default 'ai' check (kind in ('ai','owner')),
  placed_at timestamptz not null default now(),
  ended_at timestamptz,
  ended_reason text
);
create index if not exists rb_lead_calls_lead_idx on public.rb_lead_calls(lead_id);

-- Was the "Do not contact" sheet tab.
create table if not exists public.rb_do_not_contact (
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  phone text not null check (phone ~ '^\+1[2-9][0-9]{9}$'),
  reason text,
  added_at timestamptz not null default now(),
  primary key (client_id, phone)
);

-- Saves a lead. Locks the business's agent row so a double-submitted form can't create two leads.
-- Returns {"created": bool, "lead": {...}}. A repeat within 10 minutes returns the first lead.
create or replace function public.rb_create_lead(p_client uuid, p_data jsonb)
returns jsonb language plpgsql set search_path = public as $$
declare a rb_lead_agents; r rb_leads; v_phone text := p_data->>'phone';
  v_consent boolean := coalesce((p_data->>'consent')::boolean, false); v_dnc boolean;
begin
  select * into a from rb_lead_agents where client_id = p_client for update;
  if not found then raise exception 'Speed-to-lead agent is not set up for this business'; end if;
  select * into r from rb_leads where client_id = p_client and phone = v_phone and received_at > now() - interval '10 minutes'
    order by received_at desc limit 1;
  if found then return jsonb_build_object('created', false, 'lead', to_jsonb(r)); end if;
  v_dnc := exists(select 1 from rb_do_not_contact where client_id = p_client and phone = v_phone);
  insert into rb_leads(client_id, name, phone, email, address, zip, service, details, language, consent, consent_text, page_url, extra, status, notes)
  values (p_client, p_data->>'name', v_phone, nullif(p_data->>'email',''), nullif(p_data->>'address',''), nullif(p_data->>'zip',''),
    nullif(p_data->>'service',''), nullif(p_data->>'details',''), coalesce(nullif(p_data->>'language',''),'en'), v_consent,
    nullif(p_data->>'consent_text',''), nullif(p_data->>'page_url',''), coalesce(p_data->'extra','{}'::jsonb),
    case when v_dnc then 'blocked' when not v_consent then 'not_called' else 'new' end,
    case when v_dnc then 'On the do-not-contact list' when not v_consent then 'No call consent on the form' end)
  returning * into r;
  return jsonb_build_object('created', true, 'lead', to_jsonb(r));
end $$;

-- Takes the lease on a brand-new lead before dialing. Returns nothing if someone else has it.
create or replace function public.rb_claim_lead(p_lead uuid)
returns setof public.rb_leads language plpgsql set search_path = public as $$
begin
  return query update rb_leads set status = 'dialing', lease_token = gen_random_uuid(), lease_until = now() + interval '2 minutes', updated_at = now()
    where id = p_lead and status = 'new' returning *;
end $$;

-- Takes leases on leads due for another call. Leads that joined the do-not-contact list stop here.
create or replace function public.rb_claim_lead_retries(p_limit integer)
returns setof public.rb_leads language plpgsql set search_path = public as $$
begin
  update rb_leads l set status = 'stopped', notes = 'On the do-not-contact list', next_attempt_at = null, updated_at = now()
    where l.status = 'retry' and exists(select 1 from rb_do_not_contact d where d.client_id = l.client_id and d.phone = l.phone);
  return query update rb_leads set status = 'dialing', lease_token = gen_random_uuid(), lease_until = now() + interval '2 minutes', updated_at = now()
    where id in (
      select l.id from rb_leads l
      join rb_lead_agents a on a.client_id = l.client_id
      join rb_clients c on c.id = l.client_id
      where l.status = 'retry' and l.next_attempt_at <= now() and l.attempts < a.max_attempts
        and c.active and 'calls' = any(c.services) and a.mode <> 'paused'
      order by l.next_attempt_at
      for update of l skip locked
      limit greatest(1, least(p_limit, 20)))
    returning *;
end $$;

-- Records what happened when dialing. Needs the lease, so a stale worker can't overwrite newer state.
-- p_result: {"call_id","kind"} | {"error","next_attempt_at"} | {"status":"retry"|"not_called","next_attempt_at","notes"}
create or replace function public.rb_finish_lead_attempt(p_lead uuid, p_lease uuid, p_result jsonb)
returns setof public.rb_leads language plpgsql set search_path = public as $$
declare r rb_leads; a rb_lead_agents; v_kind text := coalesce(p_result->>'kind', 'ai'); v_status text := p_result->>'status';
begin
  select * into r from rb_leads where id = p_lead and lease_token = p_lease and status = 'dialing' for update;
  if not found then return; end if;
  select * into a from rb_lead_agents where client_id = r.client_id;
  if p_result ? 'call_id' then
    if v_kind not in ('ai','owner') then raise exception 'Invalid call kind'; end if;
    insert into rb_lead_calls(call_id, lead_id, client_id, kind) values (p_result->>'call_id', r.id, r.client_id, v_kind);
    return query update rb_leads set status = case when v_kind = 'owner' then 'owner_ringing' else 'calling' end,
      attempts = attempts + case when v_kind = 'ai' then 1 else 0 end,
      first_call_at = coalesce(first_call_at, now()), last_attempt_at = now(), current_call_id = p_result->>'call_id',
      next_attempt_at = null, last_error = null, lease_token = null, lease_until = null, updated_at = now()
      where id = r.id returning *;
  elsif p_result ? 'error' then
    -- A failed dial counts as an attempt, so a broken setup can't retry forever.
    return query update rb_leads set attempts = attempts + 1, last_attempt_at = now(),
      status = case when attempts + 1 >= a.max_attempts then 'failed' else 'retry' end,
      next_attempt_at = case when attempts + 1 >= a.max_attempts then null
        else coalesce((p_result->>'next_attempt_at')::timestamptz, now() + make_interval(mins => a.retry_gap_minutes)) end,
      last_error = left(p_result->>'error', 300), lease_token = null, lease_until = null, updated_at = now()
      where id = r.id returning *;
  elsif v_status in ('retry','not_called') then
    return query update rb_leads set status = v_status,
      next_attempt_at = case when v_status = 'retry' then coalesce((p_result->>'next_attempt_at')::timestamptz, now() + make_interval(mins => a.retry_gap_minutes)) end,
      notes = left(p_result->>'notes', 300), lease_token = null, lease_until = null, updated_at = now()
      where id = r.id returning *;
  else
    raise exception 'Invalid attempt result';
  end if;
end $$;

-- Applies Vapi's end-of-call report. Returns nothing for unknown, already-recorded or superseded calls.
-- p_result: {"status","next_attempt_at","ended_reason","booked","appointment_time","summary","do_not_call"}
create or replace function public.rb_record_call_result(p_call_id text, p_result jsonb)
returns setof public.rb_leads language plpgsql set search_path = public as $$
declare c rb_lead_calls; r rb_leads; v_status text := p_result->>'status';
begin
  if v_status not in ('retry','booked','handed_off','needs_owner','stopped','no_answer') then raise exception 'Invalid call status'; end if;
  select * into c from rb_lead_calls where call_id = p_call_id for update;
  if not found or c.ended_at is not null then return; end if;
  update rb_lead_calls set ended_at = now(), ended_reason = left(p_result->>'ended_reason', 100) where call_id = p_call_id;
  select * into r from rb_leads where id = c.lead_id for update;
  if coalesce((p_result->>'do_not_call')::boolean, false) then
    insert into rb_do_not_contact(client_id, phone, reason) values (r.client_id, r.phone, 'Asked on a call') on conflict do nothing;
  end if;
  if r.current_call_id is distinct from p_call_id then return; end if;
  -- A report that arrives after the sweep handed the lead to the owner must not queue another call.
  -- Only a booking or a do-not-call still updates it (neither leads to more calls).
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

-- Run by the retry worker. Leads that were saved but never dialed go back in the queue.
-- Leads stuck mid-call, or whose dial may or may not have gone out, go to the owner instead of
-- being called again (never risk calling someone twice).
create or replace function public.rb_sweep_stuck_leads()
returns setof public.rb_leads language plpgsql set search_path = public as $$
begin
  update rb_leads set status = 'retry', next_attempt_at = now(), updated_at = now()
    where status = 'new' and received_at < now() - interval '5 minutes';
  return query update rb_leads set status = 'needs_owner',
    notes = case when status = 'dialing' then 'Stopped while placing the call. Check Vapi call logs before calling again.'
      else 'No call report arrived from Vapi.' end,
    lease_token = null, lease_until = null, updated_at = now()
    where (status = 'dialing' and lease_until < now())
       or (status in ('calling','owner_ringing','owner_connecting') and last_attempt_at < now() - interval '30 minutes')
    returning *;
end $$;

-- No browser access. Only the API (service role) reads and writes these.
do $$ declare t text; f record; begin
  foreach t in array array['rb_lead_agents','rb_leads','rb_lead_calls','rb_do_not_contact'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
  for f in select oid::regprocedure as sig from pg_proc where pronamespace = 'public'::regnamespace
    and proname in ('rb_create_lead','rb_claim_lead','rb_claim_lead_retries','rb_finish_lead_attempt','rb_record_call_result','rb_sweep_stuck_leads') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
