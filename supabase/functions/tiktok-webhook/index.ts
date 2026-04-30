import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // TikTok sends webhook events as POST with a signature header
  if (req.method === 'POST') {
    const body = await req.json();

    // TikTok Business Messaging webhook event structure
    const events = Array.isArray(body) ? body : [body];

    for (const event of events) {
      // DM event
      if (event.event_type === 'MESSAGE' || event.type === 'direct_message') {
        const senderId = event.sender?.open_id ?? event.from_user_id;
        const messageText = event.message?.text ?? event.content;
        const channelMessageId = event.message?.message_id ?? event.message_id;

        if (!senderId || !messageText) continue;

        const { data: contact } = await supabase
          .from('social_contacts')
          .upsert({ channel: 'tiktok', channel_contact_id: senderId, display_name: event.sender?.display_name ?? senderId }, { onConflict: 'channel,channel_contact_id' })
          .select()
          .single();

        if (!contact) continue;

        let { data: conversation } = await supabase
          .from('social_conversations')
          .select('*')
          .eq('channel', 'tiktok')
          .eq('contact_id', contact.id)
          .single();

        if (!conversation) {
          const { data: newConv } = await supabase
            .from('social_conversations')
            .insert({ channel: 'tiktok', contact_id: contact.id })
            .select()
            .single();
          conversation = newConv;
        }

        if (!conversation) continue;

        if (channelMessageId) {
          const { data: existingMsg } = await supabase
            .from('social_messages')
            .select('id')
            .eq('channel_message_id', channelMessageId)
            .maybeSingle();
          if (existingMsg) continue;
        }

        await supabase.from('social_messages').insert({
          conversation_id: conversation.id,
          channel: 'tiktok',
          direction: 'inbound',
          sender_type: 'customer',
          content: messageText,
          channel_message_id: channelMessageId ?? null,
        });

        await supabase.from('social_conversations').update({
          unread_count: (conversation.unread_count ?? 0) + 1,
          last_message_at: new Date().toISOString(),
        }).eq('id', conversation.id);

        if (conversation.ai_enabled) {
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-reply`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({
              conversation_id: conversation.id,
              channel: 'tiktok',
              message: messageText,
              contact_tiktok_id: senderId,
            }),
          });
        }
      }

      // Comment event — check for keyword triggers and auto-DM
      if (event.event_type === 'COMMENT' || event.type === 'video_comment') {
        const commentText = event.comment?.text ?? event.content;
        const senderId = event.user?.open_id ?? event.user_id;

        if (!commentText || !senderId) continue;

        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            channel: 'tiktok',
            message: commentText,
            contact_tiktok_id: senderId,
            is_comment: true,
            comment_id: event.comment?.id ?? event.comment_id,
          }),
        });
      }
    }

    return new Response('OK', { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
});
