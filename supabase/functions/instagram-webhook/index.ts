import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const { data } = await supabase
      .from('channel_integrations')
      .select('webhook_verify_token')
      .eq('channel', 'instagram')
      .eq('webhook_verify_token', token)
      .maybeSingle();

    if (mode === 'subscribe' && data) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    if (body.object !== 'instagram') return new Response('OK', { status: 200 });

    for (const entry of body.entry ?? []) {
      // Find which business user owns this IG account
      const { data: integration } = await supabase
        .from('channel_integrations')
        .select('user_id')
        .eq('channel', 'instagram')
        .eq('ig_user_id', entry.id)
        .eq('status', 'connected')
        .maybeSingle();

      const userId = integration?.user_id;
      if (!userId) continue;

      // DMs
      for (const event of entry.messaging ?? []) {
        const senderId = event.sender?.id;
        const messageText = event.message?.text;
        const channelMessageId = event.message?.mid;
        if (!senderId || !messageText || !channelMessageId) continue;

        const { data: contact } = await supabase
          .from('social_contacts')
          .upsert(
            { channel: 'instagram', channel_contact_id: senderId, display_name: senderId, user_id: userId },
            { onConflict: 'channel,channel_contact_id,user_id' },
          )
          .select()
          .single();

        if (!contact) continue;

        let { data: conversation } = await supabase
          .from('social_conversations')
          .select('*')
          .eq('channel', 'instagram')
          .eq('contact_id', contact.id)
          .eq('user_id', userId)
          .single();

        if (!conversation) {
          const { data: newConv } = await supabase
            .from('social_conversations')
            .insert({ channel: 'instagram', contact_id: contact.id, user_id: userId })
            .select()
            .single();
          conversation = newConv;
        }

        if (!conversation) continue;

        const { data: existingMsg } = await supabase
          .from('social_messages')
          .select('id')
          .eq('channel_message_id', channelMessageId)
          .maybeSingle();
        if (existingMsg) continue;

        await supabase.from('social_messages').insert({
          conversation_id: conversation.id,
          channel: 'instagram',
          direction: 'inbound',
          sender_type: 'customer',
          content: messageText,
          channel_message_id: channelMessageId,
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
              channel: 'instagram',
              message: messageText,
              contact_ig_id: senderId,
              user_id: userId,
            }),
          });
        }
      }

      // Comment triggers
      for (const change of entry.changes ?? []) {
        if (change.field !== 'comments') continue;
        const comment = change.value;
        if (!comment?.text || !comment?.from?.id) continue;

        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            channel: 'instagram',
            message: comment.text,
            contact_ig_id: comment.from.id,
            is_comment: true,
            comment_id: comment.id,
            user_id: userId,
          }),
        });
      }
    }

    return new Response('OK', { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
});
