-- Social channel integrations: stores API keys & OAuth tokens per channel
create table if not exists public.channel_integrations (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('whatsapp', 'instagram', 'tiktok', 'sms')),
  status text not null default 'disconnected' check (status in ('connected', 'disconnected', 'error')),
  phone_number_id text,       -- WhatsApp Business Phone Number ID
  waba_id text,               -- WhatsApp Business Account ID
  ig_user_id text,            -- Instagram Business Account ID
  tiktok_app_id text,         -- TikTok App ID
  access_token text,          -- OAuth access token
  app_secret text,            -- App secret for webhook signature verification
  webhook_verify_token text not null default gen_random_uuid()::text,
  last_sync timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(channel)
);

-- Unified social contacts across all channels
create table if not exists public.social_contacts (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('whatsapp', 'instagram', 'tiktok', 'sms')),
  channel_contact_id text not null,  -- External ID from channel API
  display_name text,
  phone text,
  username text,
  avatar_url text,
  customer_id text references public.customers(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(channel, channel_contact_id)
);

-- One conversation per contact per channel
create table if not exists public.social_conversations (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('whatsapp', 'instagram', 'tiktok', 'sms')),
  contact_id uuid not null references public.social_contacts(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'resolved', 'pending')),
  last_message_at timestamptz not null default now(),
  unread_count integer not null default 0,
  ai_enabled boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Individual messages in conversations
create table if not exists public.social_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.social_conversations(id) on delete cascade,
  channel text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  sender_type text not null check (sender_type in ('customer', 'agent', 'ai')),
  content text not null,
  content_type text not null default 'text',
  channel_message_id text unique,  -- dedup by channel-native message ID
  ai_generated boolean not null default false,
  delivered_at timestamptz,
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- AI automation rules with keyword triggers
create table if not exists public.social_automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channels text[] not null default '{"whatsapp","instagram","tiktok"}',
  trigger_keywords text[] not null default '{}',
  trigger_type text not null default 'keyword' check (trigger_type in ('keyword', 'new_follower', 'comment', 'any')),
  ai_prompt text,           -- custom Claude system prompt for this rule
  response_template text,   -- fallback template when AI is off
  icon text not null default 'ri-robot-2-line',
  color_class text not null default 'bg-sky-50 border-sky-200',
  icon_color text not null default 'text-sky-600',
  is_active boolean not null default true,
  runs integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now()
);

-- Scheduled posts for cross-channel publishing
create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  channels text[] not null default '{}',
  content text not null,
  media_urls text[] not null default '{}',
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'published', 'failed', 'draft')),
  ai_generated boolean not null default false,
  published_at timestamptz,
  platform_post_ids jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Enable RLS on all new tables
alter table public.channel_integrations enable row level security;
alter table public.social_contacts enable row level security;
alter table public.social_conversations enable row level security;
alter table public.social_messages enable row level security;
alter table public.social_automation_rules enable row level security;
alter table public.scheduled_posts enable row level security;

-- Authenticated users can manage everything
create policy "auth_manage_channel_integrations"
  on public.channel_integrations for all to authenticated using (true) with check (true);

create policy "auth_manage_social_contacts"
  on public.social_contacts for all to authenticated using (true) with check (true);

create policy "auth_manage_social_conversations"
  on public.social_conversations for all to authenticated using (true) with check (true);

create policy "auth_manage_social_messages"
  on public.social_messages for all to authenticated using (true) with check (true);

create policy "auth_manage_social_automation_rules"
  on public.social_automation_rules for all to authenticated using (true) with check (true);

create policy "auth_manage_scheduled_posts"
  on public.scheduled_posts for all to authenticated using (true) with check (true);

-- Service role (edge functions) can also access
create policy "service_manage_channel_integrations"
  on public.channel_integrations for all to service_role using (true) with check (true);

create policy "service_manage_social_contacts"
  on public.social_contacts for all to service_role using (true) with check (true);

create policy "service_manage_social_conversations"
  on public.social_conversations for all to service_role using (true) with check (true);

create policy "service_manage_social_messages"
  on public.social_messages for all to service_role using (true) with check (true);

create policy "service_manage_social_automation_rules"
  on public.social_automation_rules for all to service_role using (true) with check (true);

create policy "service_manage_scheduled_posts"
  on public.scheduled_posts for all to service_role using (true) with check (true);

-- Realtime for live inbox updates
alter publication supabase_realtime add table public.social_messages;
alter publication supabase_realtime add table public.social_conversations;

-- Seed the 6 default AI automation rules
insert into public.social_automation_rules
  (name, channels, trigger_keywords, trigger_type, ai_prompt, icon, color_class, icon_color, is_active)
values
  (
    'Price Inquiry',
    '{"whatsapp","instagram","tiktok"}',
    '{"price","cost","how much","ghs","ghana cedis","cedis"}',
    'keyword',
    'The customer is asking about product prices at iDeals Tech Hub, a premium gadget shop in Accra, Ghana. Respond with available options, prices in GHS, warranty info, and a clear call-to-action to reserve or arrange delivery. Be friendly, use a few relevant emojis, and keep it concise.',
    'ri-price-tag-3-line',
    'bg-emerald-50 border-emerald-200',
    'text-emerald-600',
    true
  ),
  (
    'Trade-In Request',
    '{"whatsapp","instagram","tiktok"}',
    '{"trade","swap","exchange","sell my","trade in","trade-in"}',
    'keyword',
    'The customer wants to trade in their device at iDeals Tech Hub. Ask for the device model and condition (excellent/good/fair). Provide a realistic GHS trade-in value estimate and offer to book an appointment. Be enthusiastic and helpful.',
    'ri-exchange-line',
    'bg-amber-50 border-amber-200',
    'text-amber-600',
    true
  ),
  (
    'Repair Inquiry',
    '{"whatsapp","instagram","tiktok"}',
    '{"repair","fix","broken","screen","battery","cracked","not working"}',
    'keyword',
    'The customer needs a repair service at iDeals Tech Hub. Ask what device they have and the problem. Provide common repair prices (screen replacement GHS 400-800, battery GHS 200-400) and turnaround time (same day - 2 days). Offer to book a slot.',
    'ri-tools-line',
    'bg-sky-50 border-sky-200',
    'text-sky-600',
    true
  ),
  (
    'Order Status',
    '{"whatsapp","instagram"}',
    '{"order","delivery","where","track","status","arrived","when"}',
    'keyword',
    'The customer is asking about their order or delivery status at iDeals Tech Hub. Acknowledge the query warmly and ask for their order number or phone number to look it up. Mention that standard Accra delivery is same-day and Kumasi/regional is 1-2 business days.',
    'ri-truck-line',
    'bg-violet-50 border-violet-200',
    'text-violet-600',
    true
  ),
  (
    'Availability Check',
    '{"whatsapp","instagram","tiktok"}',
    '{"available","in stock","do you have","stock","still have"}',
    'keyword',
    'The customer is checking product availability at iDeals Tech Hub. Confirm whether the item is in stock, provide the current price, and offer to reserve it. If not in stock, suggest similar alternatives with prices. Always mention the option for same-day delivery in Accra.',
    'ri-archive-line',
    'bg-rose-50 border-rose-200',
    'text-rose-600',
    true
  ),
  (
    'Installment Plan',
    '{"whatsapp","instagram"}',
    '{"installment","monthly","pay later","credit","payment plan","pay in"}',
    'keyword',
    'The customer is asking about payment plans at iDeals Tech Hub. Explain the options: 3-month plan (0% interest), 6-month plan (5% fee), 12-month plan (10% fee). Requirements: Ghana Card + 30% initial deposit via MoMo. Make the process sound easy and attractive.',
    'ri-calendar-line',
    'bg-teal-50 border-teal-200',
    'text-teal-600',
    true
  )
on conflict do nothing;
