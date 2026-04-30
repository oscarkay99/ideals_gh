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
    case
      when coalesce(new.raw_user_meta_data ->> 'role', '') in ('admin', 'sales_manager', 'sales_rep', 'technician', 'inventory_manager')
        then new.raw_user_meta_data ->> 'role'
      else 'sales_rep'
    end,
    upper(left(coalesce(new.raw_user_meta_data ->> 'full_name', coalesce(new.email, 'U')), 1)),
    to_char(now(), 'Mon DD, YYYY')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter table public.profiles
  alter column role set default 'sales_rep';

drop policy if exists "authenticated_read_products" on public.products;
drop policy if exists "authenticated_manage_products" on public.products;
drop policy if exists "authenticated_manage_customers" on public.customers;
drop policy if exists "authenticated_manage_sales" on public.sales;
drop policy if exists "authenticated_manage_leads" on public.leads;
drop policy if exists "authenticated_manage_repairs" on public.repairs;
drop policy if exists "authenticated_manage_transactions" on public.transactions;

drop policy if exists "products_read_authenticated" on public.products;
drop policy if exists "products_manage_limited_roles" on public.products;
create policy "products_read_authenticated"
on public.products
for select
to authenticated
using (true);
create policy "products_manage_limited_roles"
on public.products
for all
to authenticated
using (public.has_any_role(array['admin', 'sales_manager', 'inventory_manager']))
with check (public.has_any_role(array['admin', 'sales_manager', 'inventory_manager']));

drop policy if exists "customers_read_authenticated" on public.customers;
drop policy if exists "customers_manage_limited_roles" on public.customers;
create policy "customers_read_authenticated"
on public.customers
for select
to authenticated
using (true);
create policy "customers_manage_limited_roles"
on public.customers
for all
to authenticated
using (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']))
with check (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']));

drop policy if exists "sales_read_authenticated" on public.sales;
drop policy if exists "sales_manage_limited_roles" on public.sales;
create policy "sales_read_authenticated"
on public.sales
for select
to authenticated
using (true);
create policy "sales_manage_limited_roles"
on public.sales
for all
to authenticated
using (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']))
with check (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']));

drop policy if exists "leads_read_authenticated" on public.leads;
drop policy if exists "leads_manage_limited_roles" on public.leads;
create policy "leads_read_authenticated"
on public.leads
for select
to authenticated
using (true);
create policy "leads_manage_limited_roles"
on public.leads
for all
to authenticated
using (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']))
with check (public.has_any_role(array['admin', 'sales_manager', 'sales_rep']));

drop policy if exists "repairs_read_authenticated" on public.repairs;
drop policy if exists "repairs_manage_limited_roles" on public.repairs;
create policy "repairs_read_authenticated"
on public.repairs
for select
to authenticated
using (true);
create policy "repairs_manage_limited_roles"
on public.repairs
for all
to authenticated
using (public.has_any_role(array['admin', 'technician']))
with check (public.has_any_role(array['admin', 'technician']));

drop policy if exists "transactions_read_authenticated" on public.transactions;
drop policy if exists "transactions_manage_limited_roles" on public.transactions;
create policy "transactions_read_authenticated"
on public.transactions
for select
to authenticated
using (true);
create policy "transactions_manage_limited_roles"
on public.transactions
for all
to authenticated
using (public.has_any_role(array['admin', 'sales_manager']))
with check (public.has_any_role(array['admin', 'sales_manager']));
