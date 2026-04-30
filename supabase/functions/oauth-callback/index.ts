import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:5173';
const META_APP_ID = Deno.env.get('META_APP_ID')!;
const META_APP_SECRET = Deno.env.get('META_APP_SECRET')!;
const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_APP_ID') ?? META_APP_ID;
const INSTAGRAM_APP_SECRET = Deno.env.get('INSTAGRAM_APP_SECRET') ?? META_APP_SECRET;
const TIKTOK_CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY')!;
const TIKTOK_CLIENT_SECRET = Deno.env.get('TIKTOK_CLIENT_SECRET')!;
const CALLBACK_URL = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function redirect(path: string) {
  return Response.redirect(`${APP_URL}${path}`, 302);
}

async function parseState(state: string): Promise<{ jwt: string; channel: string } | null> {
  try {
    // New format: base64(JSON.stringify({ jwt, channel }))
    const decoded = atob(state);
    const parsed = JSON.parse(decoded);
    if (parsed.jwt && parsed.channel) return parsed;
  } catch {
    // Fall through to legacy format
  }
  try {
    // Legacy format: base64(jwt) — channel came from query param
    const jwt = atob(state);
    return { jwt, channel: '' };
  } catch {
    return null;
  }
}

async function getUserIdFromJwt(jwt: string): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser(jwt);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

// ── Meta (Instagram + WhatsApp) ───────────────────────────────────────────────

async function handleInstagramCallback(code: string, userId: string) {
  // Exchange code using Facebook's endpoint (Facebook Login flow)
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}` +
    `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
    `&code=${code}`,
  );
  if (!tokenRes.ok) throw new Error(`Instagram/FB token exchange failed: ${await tokenRes.text()}`);
  const { access_token: shortToken } = await tokenRes.json();

  // Exchange for long-lived token (60 days)
  const longRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${META_APP_ID}` +
    `&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`,
  );
  if (!longRes.ok) throw new Error(`Instagram long-lived token failed: ${await longRes.text()}`);
  const { access_token } = await longRes.json();

  // Get Facebook Pages → Instagram Business Account ID
  let ig_user_id: string | null = null;
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${access_token}`,
  );
  const pages = await pagesRes.json();
  const page = pages.data?.[0];
  if (page) {
    const igRes = await fetch(
      `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${access_token}`,
    );
    const igData = await igRes.json();
    ig_user_id = igData.instagram_business_account?.id ?? null;
  }

  await supabase.from('channel_integrations').upsert({
    user_id: userId,
    channel: 'instagram',
    status: 'connected',
    access_token,
    ig_user_id,
    last_sync: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'channel,user_id' });
}

async function handleWhatsAppCallback(code: string, userId: string) {
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}` +
    `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
    `&code=${code}`,
  );
  if (!tokenRes.ok) throw new Error(`Meta token exchange failed: ${await tokenRes.text()}`);
  const { access_token: shortToken } = await tokenRes.json();

  const longRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${META_APP_ID}` +
    `&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`,
  );
  if (!longRes.ok) throw new Error(`Meta long-lived token failed: ${await longRes.text()}`);
  const { access_token } = await longRes.json();

  const waRes = await fetch(
    `https://graph.facebook.com/v19.0/me/whatsapp_business_accounts?access_token=${access_token}`,
  );
  const waData = await waRes.json();
  const waba_id = waData.data?.[0]?.id ?? null;
  let phone_number_id: string | null = null;

  if (waba_id) {
    const phoneRes = await fetch(
      `https://graph.facebook.com/v19.0/${waba_id}/phone_numbers?access_token=${access_token}`,
    );
    const phoneData = await phoneRes.json();
    phone_number_id = phoneData.data?.[0]?.id ?? null;
  }

  await supabase.from('channel_integrations').upsert({
    user_id: userId,
    channel: 'whatsapp',
    status: 'connected',
    access_token,
    phone_number_id,
    waba_id,
    last_sync: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'channel,user_id' });
}

// ── TikTok ────────────────────────────────────────────────────────────────────

async function handleTikTokCallback(code: string, userId: string) {
  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
    }),
  });
  if (!tokenRes.ok) throw new Error(`TikTok token exchange failed: ${await tokenRes.text()}`);
  const { data: tokenData } = await tokenRes.json();

  await supabase.from('channel_integrations').upsert({
    user_id: userId,
    channel: 'tiktok',
    status: 'connected',
    access_token: tokenData.access_token,
    tiktok_app_id: tokenData.open_id,
    last_sync: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'channel,user_id' });
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const rawState = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error, url.searchParams.get('error_description'));
    return redirect('/settings?section=integrations&error=oauth_denied');
  }

  if (!code || !rawState) {
    return redirect('/settings?section=integrations&error=missing_params');
  }

  const stateData = await parseState(rawState);
  if (!stateData) {
    return redirect('/settings?section=integrations&error=invalid_session');
  }

  // Channel comes from state (new) or query param (legacy)
  const channel = (stateData.channel || url.searchParams.get('channel')) as 'instagram' | 'whatsapp' | 'tiktok' | null;
  if (!channel) {
    return redirect('/settings?section=integrations&error=missing_params');
  }

  const userId = await getUserIdFromJwt(stateData.jwt);
  if (!userId) {
    return redirect('/settings?section=integrations&error=invalid_session');
  }

  try {
    if (channel === 'instagram') {
      await handleInstagramCallback(code, userId);
    } else if (channel === 'whatsapp') {
      await handleWhatsAppCallback(code, userId);
    } else if (channel === 'tiktok') {
      await handleTikTokCallback(code, userId);
    }
    return redirect(`/settings?section=integrations&connected=${channel}`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return redirect(`/settings?section=integrations&error=callback_failed`);
  }
});
