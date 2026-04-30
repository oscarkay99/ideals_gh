-- Make channel_integrations per-user instead of global
alter table public.channel_integrations
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Drop old global unique constraint, add per-user one
alter table public.channel_integrations
  drop constraint if exists channel_integrations_channel_key;

alter table public.channel_integrations
  drop constraint if exists channel_integrations_channel_user_id_key;

alter table public.channel_integrations
  add constraint channel_integrations_channel_user_id_key unique (channel, user_id);

-- Scope social_contacts per business (user)
alter table public.social_contacts
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.social_contacts
  drop constraint if exists social_contacts_channel_channel_contact_id_key;

alter table public.social_contacts
  add constraint social_contacts_channel_contact_user_key unique (channel, channel_contact_id, user_id);

-- Scope social_conversations per business (user)
alter table public.social_conversations
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Scope scheduled_posts per business (user)
alter table public.scheduled_posts
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Scope automation rules per business (user)
alter table public.social_automation_rules
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- ── RLS: each user sees only their own data ───────────────────────────────────

-- channel_integrations
drop policy if exists "auth_manage_channel_integrations" on public.channel_integrations;
create policy "auth_manage_channel_integrations"
  on public.channel_integrations for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- service role still needs full access for webhooks
drop policy if exists "service_manage_channel_integrations" on public.channel_integrations;
create policy "service_manage_channel_integrations"
  on public.channel_integrations for all to service_role
  using (true) with check (true);

-- social_contacts
drop policy if exists "auth_manage_social_contacts" on public.social_contacts;
create policy "auth_manage_social_contacts"
  on public.social_contacts for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "service_manage_social_contacts" on public.social_contacts;
create policy "service_manage_social_contacts"
  on public.social_contacts for all to service_role
  using (true) with check (true);

-- social_conversations
drop policy if exists "auth_manage_social_conversations" on public.social_conversations;
create policy "auth_manage_social_conversations"
  on public.social_conversations for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "service_manage_social_conversations" on public.social_conversations;
create policy "service_manage_social_conversations"
  on public.social_conversations for all to service_role
  using (true) with check (true);

-- social_messages (scoped via conversation's user_id)
drop policy if exists "auth_manage_social_messages" on public.social_messages;
create policy "auth_manage_social_messages"
  on public.social_messages for all to authenticated
  using (
    exists (
      select 1 from public.social_conversations c
      where c.id = social_messages.conversation_id
      and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.social_conversations c
      where c.id = social_messages.conversation_id
      and c.user_id = auth.uid()
    )
  );

-- scheduled_posts
drop policy if exists "auth_manage_scheduled_posts" on public.scheduled_posts;
create policy "auth_manage_scheduled_posts"
  on public.scheduled_posts for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- social_automation_rules: global rules (user_id null) + per-user rules
drop policy if exists "auth_manage_social_automation_rules" on public.social_automation_rules;
create policy "auth_manage_social_automation_rules"
  on public.social_automation_rules for all to authenticated
  using (user_id is null or auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "service_manage_social_automation_rules" on public.social_automation_rules;
create policy "service_manage_social_automation_rules"
  on public.social_automation_rules for all to service_role
  using (true) with check (true);
