-- Speed-to-lead agent, part 2: owner-first calls, inbound callbacks, team "stop calling".
-- Run after 20261110_speed_to_lead.sql. Additive and safe to re-run.
begin;

-- Inbound callbacks may come from a number with no lead, so lead_id becomes optional,
-- and each inbound call keeps the caller's number and summary.
alter table public.rb_lead_calls alter column lead_id drop not null;
alter table public.rb_lead_calls add column if not exists phone text;
alter table public.rb_lead_calls add column if not exists summary text;
alter table public.rb_lead_calls drop constraint if exists rb_lead_calls_kind_check;
alter table public.rb_lead_calls add constraint rb_lead_calls_kind_check check (kind in ('ai','owner','inbound'));
create index if not exists rb_lead_calls_client_idx on public.rb_lead_calls(client_id, placed_at desc);

-- Moves a lead from one of p_from to p_to, only if it is still in p_from (so a stale callback is a no-op).
-- p_lease = true also takes a dialing lease (used when owner-first hands over to the AI call).
create or replace function public.rb_lead_transition(p_lead uuid, p_from text[], p_to text, p_notes text default null,
  p_next timestamptz default null, p_lease boolean default false)
returns setof public.rb_leads language plpgsql set search_path = public as $$
begin
  if p_to not in ('dialing','retry','owner_connecting','owner_talked','not_called','needs_owner') then raise exception 'Invalid transition'; end if;
  return query update rb_leads set status = p_to,
    notes = coalesce(left(p_notes, 300), notes),
    next_attempt_at = case when p_to = 'retry' then coalesce(p_next, now()) end,
    lease_token = case when p_lease then gen_random_uuid() end,
    lease_until = case when p_lease then now() + interval '2 minutes' end,
    updated_at = now()
    where id = p_lead and status = any(p_from) returning *;
end $$;

-- Records a call the lead made back to the business number. Once per Vapi call id.
-- A booking or do-not-call updates the lead; any other callback stops queued retries
-- and hands the lead to the owner (they called back, so don't keep calling them).
-- Returns {"recorded": bool, "lead": {...} | null}.
create or replace function public.rb_record_inbound_call(p_call_id text, p_client uuid, p_phone text, p_result jsonb)
returns jsonb language plpgsql set search_path = public as $$
declare r rb_leads; u rb_leads; v_booked boolean := coalesce((p_result->>'booked')::boolean, false);
  v_dnc boolean := coalesce((p_result->>'do_not_call')::boolean, false); v_rows integer;
begin
  select * into r from rb_leads where client_id = p_client and phone = p_phone order by received_at desc limit 1 for update;
  insert into rb_lead_calls(call_id, lead_id, client_id, kind, phone, summary, ended_at, ended_reason)
    values (p_call_id, r.id, p_client, 'inbound', p_phone, left(p_result->>'summary', 4000), now(), left(p_result->>'ended_reason', 100))
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
  for f in select oid::regprocedure as sig from pg_proc where pronamespace = 'public'::regnamespace
    and proname in ('rb_lead_transition','rb_record_inbound_call') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
