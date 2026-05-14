drop policy if exists "audit_logs_select_admin_and_managers" on public.audit_logs;

create policy "audit_logs_select_authenticated"
on public.audit_logs
for select
to authenticated
using (true);
