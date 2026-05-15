-- Add missing columns to profiles
alter table public.profiles add column if not exists phone text not null default '';
alter table public.profiles add column if not exists status text not null default 'active'
  check (status in ('active', 'inactive', 'suspended'));
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- Safe helper to get current user's role (avoids RLS recursion)
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Admins and sales_managers can read all profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.current_user_role() in ('admin', 'sales_manager')
);

-- Admins can update any profile (role, status, phone, etc.)
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Admins can delete profiles
drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles
for delete
to authenticated
using (public.current_user_role() = 'admin');
