import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  // GET: Meta webhook verification
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Verify token can match any registered business
    const { data } = await supabase
      .from('channel_integrations')
      .select('webhook_verify_token')
      .eq('channel', 'whatsapp')
      .eq('webhook_verify_token', token)
      .maybeSingle();

    if (mode === 'subscribe' && data) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    if (body.object !== 'whatsapp_business_account') {
      return new Response('OK', { status: 200 });
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue;
        const value = change.value;
        const incomingPhoneNumberId = value.metadata?.phone_number_id;

        // Find which business user owns this phone number ID
        const { data: integration } = await supabase
          .from('channel_integrations')
          .select('user_id')
          .eq('channel', 'whatsapp')
          .eq('phone_number_id', incomingPhoneNumberId)
          .eq('status', 'connected')
          .maybeSingle();

        if (!integration?.user_id) continue;
        const userId = integration.user_id;

        for (const msg of value.messages ?? []) {
          if (msg.type !== 'text') continue;

          const waId = msg.from;
          const contactName = value.contacts?.find((c: any) => c.wa_id === waId)?.profile?.name ?? waId;
          const messageText = msg.text?.body ?? '';
          const channelMessageId = msg.id;

          // Upsert contact scoped to this business user
          const { data: contact } = await supabase
            .from('social_contacts')
            .upsert(
              { channel: 'whatsapp', channel_contact_id: waId, display_name: contactName, phone: waId, user_id: userId },
              { onConflict: 'channel,channel_contact_id,user_id' },
            )
            .select()
            .single();

          if (!contact) continue;

          // Upsert conversation
          let { data: conversation } = await supabase
            .from('social_conversations')
            .select('*')
            .eq('channel', 'whatsapp')
            .eq('contact_id', contact.id)
            .eq('user_id', userId)
            .single();

          if (!conversation) {
            const { data: newConv } = await supabase
              .from('social_conversations')
              .insert({ channel: 'whatsapp', contact_id: contact.id, user_id: userId })
              .select()
              .single();
            conversation = newConv;
          }

          if (!conversation) continue;

          // Dedup
          const { data: existingMsg } = await supabase
            .from('social_messages')
            .select('id')
            .eq('channel_message_id', channelMessageId)
            .maybeSingle();
          if (existingMsg) continue;

          await supabase.from('social_messages').insert({
            conversation_id: conversation.id,
            channel: 'whatsapp',
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
                channel: 'whatsapp',
                message: messageText,
                contact_phone: waId,
                user_id: userId,
              }),
            });
          }
        }
      }
    }

    return new Response('OK', { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
});
