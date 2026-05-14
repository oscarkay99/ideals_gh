create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'backend' check (source in ('frontend', 'backend')),
  layer text not null default 'database' check (layer in ('ui', 'auth', 'service', 'database', 'edge_function')),
  action text not null,
  entity_type text,
  entity_id text,
  actor_user_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  actor_name text,
  request_path text,
  ip_address inet,
  user_agent text,
  status text not null default 'success' check (status in ('success', 'failure', 'attempted', 'info')),
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_actor_user_id_idx
  on public.audit_logs (actor_user_id, created_at desc);

create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);

create or replace function public.sanitize_audit_payload(payload jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(payload, '{}'::jsonb)
    - 'access_token'
    - 'refresh_token'
    - 'app_secret'
    - 'webhook_verify_token'
    - 'password'
    - 'secret'
    - 'token'
    - 'authorization'
$$;

create or replace function public.capture_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  claims jsonb := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
  actor_id uuid := auth.uid();
  actor_role text := coalesce(claims ->> 'role', auth.role(), 'unknown');
  actor_email_value text;
  actor_name_value text;
  entity_identifier text;
  previous_data jsonb;
  next_data jsonb;
  old_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
begin
  if tg_table_name = 'audit_logs' then
    return coalesce(new, old);
  end if;

  entity_identifier := coalesce(
    coalesce(new_row, old_row) ->> 'id',
    coalesce(new_row, old_row) ->> 'session_id',
    coalesce(new_row, old_row) ->> 'channel_contact_id'
  );

  if actor_id is not null then
    select email, name
      into actor_email_value, actor_name_value
    from public.profiles
    where id = actor_id;
  end if;

  previous_data := case
    when tg_op in ('UPDATE', 'DELETE') then public.sanitize_audit_payload(old_row)
    else null
  end;

  next_data := case
    when tg_op in ('INSERT', 'UPDATE') then public.sanitize_audit_payload(new_row)
    else null
  end;

  insert into public.audit_logs (
    source,
    layer,
    action,
    entity_type,
    entity_id,
    actor_user_id,
    actor_email,
    actor_name,
    status,
    summary,
    metadata,
    before_data,
    after_data
  )
  values (
    'backend',
    'database',
    lower(tg_op),
    tg_table_name,
    entity_identifier,
    actor_id,
    coalesce(actor_email_value, claims ->> 'email'),
    coalesce(actor_name_value, claims ->> 'name', claims ->> 'email'),
    'success',
    format('%s %s', lower(tg_op), tg_table_name),
    jsonb_build_object(
      'schema', tg_table_schema,
      'table', tg_table_name,
      'trigger', tg_name,
      'actor_role', actor_role
    ),
    previous_data,
    next_data
  );

  return coalesce(new, old);
exception
  when others then
    raise warning 'Failed to capture audit log for %.%: %', tg_table_schema, tg_table_name, sqlerrm;
    return coalesce(new, old);
end;
$$;

alter table public.audit_logs enable row level security;

drop policy if exists "audit_logs_select_admin_and_managers" on public.audit_logs;
create policy "audit_logs_select_admin_and_managers"
on public.audit_logs
for select
to authenticated
using (public.has_any_role(array['admin', 'sales_manager', 'inventory_manager']));

drop policy if exists "audit_logs_insert_authenticated" on public.audit_logs;
create policy "audit_logs_insert_authenticated"
on public.audit_logs
for insert
to authenticated
with check (
  source = 'frontend'
  and auth.uid() is not null
  and (actor_user_id is null or actor_user_id = auth.uid())
);

drop policy if exists "audit_logs_insert_service_role" on public.audit_logs;
create policy "audit_logs_insert_service_role"
on public.audit_logs
for insert
to service_role
with check (true);

do $$
declare
  table_name text;
  audited_tables text[] := array[
    'profiles',
    'products',
    'inventory',
    'customers',
    'sales',
    'leads',
    'repairs',
    'transactions',
    'expenses',
    'events',
    'purchase_orders',
    'settings',
    'channel_integrations',
    'social_contacts',
    'social_conversations',
    'social_messages',
    'social_automation_rules',
    'scheduled_posts',
    'pos_transactions'
  ];
begin
  foreach table_name in array audited_tables loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('drop trigger if exists audit_%I_changes on public.%I', table_name, table_name);
      execute format(
        'create trigger audit_%I_changes after insert or update or delete on public.%I for each row execute procedure public.capture_audit_log()',
        table_name,
        table_name
      );
    end if;
  end loop;
end $$;
