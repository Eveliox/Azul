-- Run after 20261007_ai_agents_service.sql. Additive; no existing accounts or plans change.
begin;
create table if not exists public.rb_workspace_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  email text, created_at timestamptz not null default now(), primary key(user_id, client_id)
);
create table if not exists public.rb_agency_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.rb_agent_settings (
  client_id uuid primary key references public.rb_clients(id) on delete cascade,
  mode text not null default 'testing' check (mode in ('testing','active','paused')),
  reply_to text not null default '',
  monthly_limit integer not null default 100 check (monthly_limit between 1 and 1000),
  monthly_budget_cents integer not null default 1000 check (monthly_budget_cents between 1 and 100000),
  updated_at timestamptz not null default now()
);
create table if not exists public.rb_agent_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  request_key uuid not null,
  estimate_ref text not null check (length(estimate_ref) between 1 and 100),
  customer_name text not null check (length(customer_name) between 1 and 120),
  customer_email text not null check (length(customer_email) between 3 and 254),
  estimate_summary text not null check (length(estimate_summary) between 1 and 3000),
  language text not null default 'en' check (language in ('en','es')),
  contact_confirmed boolean not null check (contact_confirmed),
  status text not null default 'queued' check(status in ('queued','drafting','awaiting_approval','approved','sending','sent','rejected','cancelled','failed','needs_attention')),
  subject text, body text,
  created_by uuid references auth.users(id), approved_by uuid references auth.users(id),
  approved_at timestamptz, actor_id uuid references auth.users(id),
  draft_attempts integer not null default 0, send_attempts integer not null default 0,
  lease_token uuid, lease_until timestamptz, next_attempt_at timestamptz not null default now(),
  first_send_at timestamptz, envelope jsonb, provider_message_id text,
  last_error text, model text, input_tokens integer, output_tokens integer,
  reserved_cents integer not null default 0, estimated_cost_cents numeric,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(client_id, request_key), unique(client_id, estimate_ref)
);
create index if not exists rb_agent_work_idx on public.rb_agent_runs(status, next_attempt_at);
create index if not exists rb_agent_client_idx on public.rb_agent_runs(client_id, created_at desc);
create table if not exists public.rb_agent_events (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  run_id uuid references public.rb_agent_runs(id) on delete cascade,
  action text not null, actor_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists rb_agent_events_client_idx on public.rb_agent_events(client_id, created_at desc);
create table if not exists public.rb_delivery_progress (
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  period text not null, task_id text not null, completed_at timestamptz not null default now(),
  completed_by uuid references auth.users(id), primary key(client_id, period, task_id)
);
create table if not exists public.rb_worker_heartbeat (
  name text primary key, last_seen_at timestamptz not null default now()
);

create or replace function public.rb_agent_audit() returns trigger language plpgsql set search_path = public as $$
begin
  if TG_OP = 'INSERT' or old.status is distinct from new.status then
    insert into rb_agent_events(client_id, run_id, action, actor_id)
    values(new.client_id, new.id, new.status, new.actor_id);
  end if;
  return new;
end $$;
drop trigger if exists rb_agent_audit_trigger on public.rb_agent_runs;
create trigger rb_agent_audit_trigger after insert or update on public.rb_agent_runs for each row execute function public.rb_agent_audit();

-- Serializes per-business quota checks with settings changes and work claims.
create or replace function public.rb_create_agent_run(p_client uuid, p_actor uuid, p_data jsonb)
returns public.rb_agent_runs language plpgsql set search_path = public as $$
declare cfg rb_agent_settings; r rb_agent_runs; n integer;
begin
  if not exists(select 1 from rb_clients where id=p_client and active and 'agents'=any(services)) then raise exception 'AI Agents is not enabled for this business'; end if;
  insert into rb_agent_settings(client_id) values(p_client) on conflict do nothing;
  select * into cfg from rb_agent_settings where client_id=p_client for update;
  select * into r from rb_agent_runs where client_id=p_client and request_key=(p_data->>'request_key')::uuid;
  if found then return r; end if;
  if cfg.mode='paused' then raise exception 'Agent is paused'; end if;
  select count(*) into n from rb_agent_runs where client_id=p_client and created_at >= date_trunc('month', now() at time zone 'UTC') at time zone 'UTC';
  if n >= cfg.monthly_limit then raise exception 'Monthly run limit reached'; end if;
  insert into rb_agent_runs(client_id,request_key,estimate_ref,customer_name,customer_email,estimate_summary,language,contact_confirmed,created_by,actor_id)
  values(p_client,(p_data->>'request_key')::uuid,p_data->>'estimate_ref',p_data->>'customer_name',p_data->>'customer_email',p_data->>'estimate_summary',p_data->>'language',(p_data->>'contact_confirmed')::boolean,p_actor,p_actor) returning * into r;
  return r;
end $$;

create or replace function public.rb_agent_action(p_client uuid,p_run uuid,p_actor uuid,p_action text,p_subject text default null,p_body text default null)
returns public.rb_agent_runs language plpgsql set search_path = public as $$
declare r rb_agent_runs;
begin
  select * into r from rb_agent_runs where id=p_run and client_id=p_client for update;
  if not found then raise exception 'Run not found'; end if;
  if p_action='approve' and r.status='awaiting_approval' then
    if length(trim(p_subject)) not between 1 and 160 or length(trim(p_body)) not between 1 and 4000 or p_subject is null or p_body is null then raise exception 'A subject and message are required'; end if;
    update rb_agent_runs set status='approved',subject=trim(p_subject),body=trim(p_body),approved_by=p_actor,approved_at=now(),actor_id=p_actor,updated_at=now() where id=p_run returning * into r;
  elsif p_action='reject' and r.status='awaiting_approval' then
    update rb_agent_runs set status='rejected',actor_id=p_actor,updated_at=now() where id=p_run returning * into r;
  elsif p_action='retry_draft' and r.status='failed' and r.first_send_at is null then
    update rb_agent_runs set status='queued',draft_attempts=0,last_error=null,next_attempt_at=now(),actor_id=p_actor,updated_at=now() where id=p_run returning * into r;
  elsif p_action='cancel' and r.status in ('queued','awaiting_approval','approved','failed','needs_attention') then
    update rb_agent_runs set status='cancelled',actor_id=p_actor,updated_at=now() where id=p_run returning * into r;
  else raise exception 'Run changed or this action is not available'; end if;
  return r;
end $$;

-- One atomic work claim. Expired sends are retried only within the provider's
-- idempotency window, always with the same persisted envelope and key.
create or replace function public.rb_claim_agent_work(p_send boolean,p_reserve integer,p_from text)
returns setof public.rb_agent_runs language plpgsql set search_path = public as $$
declare r rb_agent_runs; cfg rb_agent_settings; used bigint;
begin
  if p_reserve < 1 or p_reserve > 100000 then raise exception 'Invalid reservation'; end if;
  insert into rb_worker_heartbeat(name) values('estimate-follow-up') on conflict(name) do update set last_seen_at=now();
  for cfg in select s.* from rb_agent_settings s join rb_clients c on c.id=s.client_id
    where c.active and 'agents'=any(c.services) and s.mode <> 'paused'
    order by s.updated_at for update of s skip locked loop
    update rb_agent_runs set status='needs_attention',last_error='Delivery needs reconciliation. Check the email provider before any new follow-up.',actor_id=null,updated_at=now()
    where client_id=cfg.client_id and status='sending' and lease_until < now() and (first_send_at < now()-interval '20 hours' or send_attempts >= 3);
    update rb_agent_runs set status='failed',last_error='Draft attempts exhausted. Review this estimate before creating another follow-up.',actor_id=null,updated_at=now()
    where client_id=cfg.client_id and status='drafting' and lease_until < now() and draft_attempts >= 3;
    select * into r from rb_agent_runs where client_id=cfg.client_id and next_attempt_at<=now() and (
      status='queued' or (status='drafting' and lease_until<now() and draft_attempts<3) or
      (p_send and cfg.mode='active' and length(cfg.reply_to)>3 and length(p_from)>3 and (
        status='approved' or (status='sending' and lease_until<now() and send_attempts<3 and first_send_at>now()-interval '20 hours')
      ))) order by case when status in ('approved','sending') then 0 else 1 end, created_at for update skip locked limit 1;
    if not found then continue; end if;
    if r.status in ('queued','drafting') then
      -- Reserve every model attempt, including retries after crashes. Never refund
      -- unknown usage. Monthly budget counts reservations made this calendar month.
      select coalesce(sum(amount_cents),0) into used from rb_agent_budget where client_id=cfg.client_id and created_at>=date_trunc('month', now() at time zone 'UTC') at time zone 'UTC';
      if used+p_reserve > cfg.monthly_budget_cents then continue; end if;
      insert into rb_agent_budget(client_id,run_id,amount_cents) values(cfg.client_id,r.id,p_reserve);
      update rb_agent_runs set status='drafting',draft_attempts=draft_attempts+1,reserved_cents=reserved_cents+p_reserve,lease_token=gen_random_uuid(),lease_until=now()+interval '2 minutes',actor_id=null,updated_at=now() where id=r.id returning * into r;
    else
      update rb_agent_runs set status='sending',send_attempts=send_attempts+1,first_send_at=coalesce(first_send_at,now()),
      envelope=coalesce(envelope,jsonb_build_object('from',p_from,'to',customer_email,'reply_to',cfg.reply_to,'subject',subject,'text',body)),
      lease_token=gen_random_uuid(),lease_until=now()+interval '2 minutes',actor_id=null,updated_at=now() where id=r.id returning * into r;
    end if;
    return next r; return;
  end loop;
end $$;
create table if not exists public.rb_agent_budget (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.rb_clients(id) on delete cascade,
  run_id uuid not null references public.rb_agent_runs(id) on delete cascade,
  amount_cents integer not null check(amount_cents>0), created_at timestamptz not null default now()
);
create index if not exists rb_agent_budget_month_idx on public.rb_agent_budget(client_id,created_at);

-- Completion requires the claim token, so a stale worker cannot overwrite newer work.
create or replace function public.rb_finish_agent_work(p_run uuid,p_lease uuid,p_result jsonb)
returns boolean language plpgsql set search_path = public as $$
declare r rb_agent_runs;
begin
  select * into r from rb_agent_runs where id=p_run and lease_token=p_lease and status in ('drafting','sending') for update;
  if not found then return false; end if;
  if p_result ? 'error' then
    update rb_agent_runs set status=case when r.status='drafting' then case when draft_attempts<3 then 'queued' else 'failed' end
      when coalesce((p_result->>'permanent')::boolean,false) then 'needs_attention' else 'sending' end,
      last_error=left(p_result->>'error',300),lease_until=now()+interval '5 minutes',next_attempt_at=now()+interval '5 minutes',actor_id=null,updated_at=now() where id=p_run;
  elsif r.status='drafting' then
    update rb_agent_runs set status='awaiting_approval',subject=p_result->>'subject',body=p_result->>'body',
      model=p_result->>'model',input_tokens=(p_result->>'input_tokens')::integer,output_tokens=(p_result->>'output_tokens')::integer,
      estimated_cost_cents=(p_result->>'estimated_cost_cents')::numeric,last_error=null,lease_until=null,actor_id=null,updated_at=now() where id=p_run;
  else
    update rb_agent_runs set status='sent',provider_message_id=p_result->>'message_id',last_error=null,lease_until=null,actor_id=null,updated_at=now() where id=p_run;
  end if;
  return true;
end $$;

create or replace function public.rb_agent_usage(p_client uuid)
returns jsonb language sql set search_path = public as $$
  select jsonb_build_object(
    'monthly_runs',(select count(*) from rb_agent_runs where client_id=p_client and created_at >= date_trunc('month', now() at time zone 'UTC') at time zone 'UTC'),
    'reserved_cents',(select coalesce(sum(amount_cents),0) from rb_agent_budget where client_id=p_client and created_at >= date_trunc('month', now() at time zone 'UTC') at time zone 'UTC')
  );
$$;
create or replace function public.rb_update_agent_settings(p_client uuid,p_actor uuid,p_data jsonb)
returns void language plpgsql set search_path = public as $$
begin
  insert into rb_agent_settings(client_id,mode,reply_to,monthly_limit,monthly_budget_cents,updated_at)
  values(p_client,p_data->>'mode',p_data->>'reply_to',(p_data->>'monthly_limit')::integer,(p_data->>'monthly_budget_cents')::integer,now())
  on conflict(client_id) do update set mode=excluded.mode,reply_to=excluded.reply_to,monthly_limit=excluded.monthly_limit,monthly_budget_cents=excluded.monthly_budget_cents,updated_at=now();
  insert into rb_agent_events(client_id,action,actor_id) values(p_client,'settings:'||(p_data->>'mode'),p_actor);
end $$;

-- No browser table/RPC access. Authenticated API checks membership, then service role calls these.
do $$ declare t text; f record; begin
  foreach t in array array['rb_workspace_members','rb_agency_admins','rb_agent_settings','rb_agent_runs','rb_agent_events','rb_agent_budget','rb_delivery_progress','rb_worker_heartbeat'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('grant all on public.%I to service_role',t);
  end loop;
  for f in select oid::regprocedure as sig from pg_proc where pronamespace='public'::regnamespace and proname in ('rb_agent_audit','rb_create_agent_run','rb_agent_action','rb_claim_agent_work','rb_finish_agent_work','rb_agent_usage','rb_update_agent_settings') loop
    execute format('revoke all on function %s from public,anon,authenticated',f.sig);
    execute format('grant execute on function %s to service_role',f.sig);
  end loop;
end $$;
grant usage,select on sequence public.rb_agent_events_id_seq,public.rb_agent_budget_id_seq to service_role;
commit;
