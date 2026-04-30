import { isSupabaseConfigured } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

async function callEdgeFunction(name: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge function ${name} failed: ${text}`);
  }
  return res.json();
}

export interface PostVariation {
  caption: string;
  hook: string;
  cta: string;
}

export interface GeneratePostResult {
  variations: PostVariation[];
}

export async function generatePostContent(params: {
  topic: string;
  channel: 'instagram' | 'tiktok' | 'whatsapp';
  tone?: string;
  product?: string;
  price?: string;
}): Promise<GeneratePostResult> {
  if (!isSupabaseConfigured) {
    // Return mock AI content when not configured
    return {
      variations: [
        {
          caption: `🔥 ${params.product ?? params.topic} just dropped at iDeals Tech Hub! Premium quality, unbeatable prices. Visit us at Accra Mall or DM to order today! #iDealsGhana #AccraTech #GadgetGhana`,
          hook: `🔥 ${params.product ?? params.topic} just dropped!`,
          cta: 'DM us now or visit Accra Mall to grab yours!',
        },
        {
          caption: `✨ Looking for the best deal on ${params.product ?? params.topic}? Look no further! iDeals Tech Hub has you covered with top quality and warranty. Shop now! 📱 #iDealsGhana #TechAccra`,
          hook: `✨ Best deal on ${params.product ?? params.topic} in Accra!`,
          cta: 'Reply YES to get yours delivered today!',
        },
        {
          caption: `💥 FLASH DEAL: ${params.product ?? params.topic} available NOW at iDeals Tech Hub! Limited stock — don't miss out. WhatsApp us or visit Accra Mall. 🛒 #AccraMall #GhanaPhone`,
          hook: `💥 Limited stock alert on ${params.product ?? params.topic}!`,
          cta: 'Call or WhatsApp now before it sells out!',
        },
      ],
    };
  }

  return callEdgeFunction('ai-generate-post', params);
}

export interface AiReplyResult {
  reply: string;
  rule: string | null;
}

export async function generateAiReply(params: {
  conversation_id: string;
  channel: string;
  message: string;
}): Promise<AiReplyResult> {
  if (!isSupabaseConfigured) {
    return {
      reply: 'Hi! Thanks for reaching out to iDeals Tech Hub. How can we help you today? 😊',
      rule: null,
    };
  }
  return callEdgeFunction('ai-reply', { ...params, skip_send: true });
}
