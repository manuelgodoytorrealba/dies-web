import { json } from '@sveltejs/kit';
import { supabasePublic } from '$lib/server/supabase';

const LEADS_TABLE = 'leads';

export async function POST({ request }) {
  try {
    const body = await request.json();

    const payload = {
      product_id: body.product_id ?? null,
      size: body.talla ?? null,
      channel: 'whatsapp',
      status: 'new',
      // lo que NO sabemos aún:
      user_id: null,
      phone: null,
      name: null,
      notes: null
    };

    const { error } = await supabasePublic
      .from(LEADS_TABLE)
      .insert(payload);

    if (error) {
      console.error('[api/leads POST] supabase error', error);
      return json({ ok: false }, { status: 200 });
    }

    return json({ ok: true });

  } catch (err) {
    console.error('[api/leads POST]', err);
    return json({ ok: false }, { status: 200 });
  }
}