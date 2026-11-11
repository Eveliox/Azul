-- Speed-to-lead agent, part 3: business details (filled in by the client), Azul-built assistants, test calls.
-- Run after 20261111_speed_to_lead_owner_inbound.sql. Additive and safe to re-run.
begin;

-- 'vapi' = call with the assistant saved in Vapi (vapi_assistant_id, as before).
-- 'azul' = build the assistant from the business details on every call (prompts live in Azul's code).
alter table public.rb_lead_agents add column if not exists assistant_mode text not null default 'vapi';
alter table public.rb_lead_agents drop constraint if exists rb_lead_agents_assistant_mode_check;
alter table public.rb_lead_agents add constraint rb_lead_agents_assistant_mode_check check (assistant_mode in ('vapi','azul'));
-- Saved Vapi tools this business's calendar uses (check availability, book). Used in 'azul' mode.
alter table public.rb_lead_agents add column if not exists calendar_tool_ids text[] not null default '{}';
-- With Azul-built assistants the saved assistant ID is optional.
alter table public.rb_lead_agents alter column vapi_assistant_id drop not null;

-- Test calls from the dashboard: never retried, kept out of the monthly numbers.
alter table public.rb_leads add column if not exists is_test boolean not null default false;

-- The business's own description of how the agent should work. Their team can edit it.
create table if not exists public.rb_lead_profiles (
  client_id uuid primary key references public.rb_clients(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid
);

-- Test calls from the dashboard skip the 10-minute duplicate guard (you test the same phone repeatedly).
create or replace function public.rb_create_lead(p_client uuid, p_data jsonb)
returns jsonb language plpgsql set search_path = public as $$
declare a rb_lead_agents; r rb_leads; v_phone text := p_data->>'phone';
  v_consent boolean := coalesce((p_data->>'consent')::boolean, false); v_dnc boolean;
  v_test boolean := coalesce((p_data->>'test')::boolean, false);
begin
  select * into a from rb_lead_agents where client_id = p_client for update;
  if not found then raise exception 'Speed-to-lead agent is not set up for this business'; end if;
  if not v_test then
    select * into r from rb_leads where client_id = p_client and phone = v_phone and received_at > now() - interval '10 minutes'
      order by received_at desc limit 1;
    if found then return jsonb_build_object('created', false, 'lead', to_jsonb(r)); end if;
  end if;
  v_dnc := exists(select 1 from rb_do_not_contact where client_id = p_client and phone = v_phone);
  insert into rb_leads(client_id, is_test, name, phone, email, address, zip, service, details, language, consent, consent_text, page_url, extra, status, notes)
  values (p_client, v_test, p_data->>'name', v_phone, nullif(p_data->>'email',''), nullif(p_data->>'address',''), nullif(p_data->>'zip',''),
    nullif(p_data->>'service',''), nullif(p_data->>'details',''), coalesce(nullif(p_data->>'language',''),'en'), v_consent,
    nullif(p_data->>'consent_text',''), nullif(p_data->>'page_url',''), coalesce(p_data->'extra','{}'::jsonb),
    case when v_dnc then 'blocked' when not v_consent then 'not_called' else 'new' end,
    case when v_dnc then 'On the do-not-contact list' when not v_consent then 'No call consent on the form' when v_test then 'Test call from the dashboard' end)
  returning * into r;
  return jsonb_build_object('created', true, 'lead', to_jsonb(r));
end $$;

-- Same as before, but test leads are never retried.
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
      where l.status = 'retry' and not l.is_test and l.next_attempt_at <= now() and l.attempts < a.max_attempts
        and c.active and 'calls' = any(c.services) and a.mode <> 'paused'
      order by l.next_attempt_at
      for update of l skip locked
      limit greatest(1, least(p_limit, 20)))
    returning *;
end $$;

do $$ declare f record; begin
  execute 'alter table public.rb_lead_profiles enable row level security';
  execute 'revoke all on public.rb_lead_profiles from public, anon, authenticated';
  execute 'grant all on public.rb_lead_profiles to service_role';
  for f in select oid::regprocedure as sig from pg_proc where pronamespace = 'public'::regnamespace and proname in ('rb_create_lead','rb_claim_lead_retries') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
