-- Apply before deploying AI Agents plan assignment. Existing subscriptions stay unchanged.
begin;
alter table public.rb_clients drop constraint if exists rb_clients_services_check;
alter table public.rb_clients add constraint rb_clients_services_check
  check (services <@ array['website','calls','reviews','seo','agents']::text[]);
commit;
