create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null default 'admin' check (role in ('admin', 'sales_manager', 'sales_rep', 'technician', 'inventory_manager')),
  avatar text not null default 'U',
  last_login text not null default to_char(now(), 'Mon DD, YYYY')
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  condition text not null,
  price text not null,
  original_price text,
  stock integer not null default 0,
  warranty text not null,
  image text not null,
  badge text,
  warranty_details text,
  condition_details jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  add_ons jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  phone text not null,
  email text not null,
  segment text not null,
  ltv text not null,
  orders integer not null default 0,
  last_order text not null,
  avg_order text not null,
  warranties integer not null default 0,
  repairs integer not null default 0,
  since text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id text primary key,
  customer text not null,
  items text not null,
  total text not null,
  method text not null,
  status text not null,
  date text not null,
  delivery text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key,
  name text not null,
  phone text not null,
  source text not null,
  status text not null,
  product text not null,
  budget text not null,
  last_contact text not null,
  assigned text not null,
  notes text not null,
  follow_up text not null,
  quote_ready boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.repairs (
  id text primary key,
  customer text not null,
  device text not null,
  issue text not null,
  status text not null,
  technician text not null,
  eta text not null,
  cost text not null,
  started text not null,
  warranty boolean not null default false,
  parts jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id text primary key,
  customer text not null,
  amount text not null,
  method text not null,
  status text not null,
  reference text not null,
  date text not null,
  product text not null,
  proof_note text,
  time text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, avatar, last_login)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, 'User'), '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'admin'),
    upper(left(coalesce(new.raw_user_meta_data ->> 'full_name', coalesce(new.email, 'U')), 1)),
    to_char(now(), 'Mon DD, YYYY')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.leads enable row level security;
alter table public.repairs enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
on public.profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "authenticated_read_products" on public.products;
create policy "authenticated_read_products"
on public.products
for select
to authenticated
using (true);

drop policy if exists "authenticated_manage_products" on public.products;
create policy "authenticated_manage_products"
on public.products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_manage_customers" on public.customers;
create policy "authenticated_manage_customers"
on public.customers
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_manage_sales" on public.sales;
create policy "authenticated_manage_sales"
on public.sales
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_manage_leads" on public.leads;
create policy "authenticated_manage_leads"
on public.leads
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_manage_repairs" on public.repairs;
create policy "authenticated_manage_repairs"
on public.repairs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_manage_transactions" on public.transactions;
create policy "authenticated_manage_transactions"
on public.transactions
for all
to authenticated
using (true)
with check (true);
