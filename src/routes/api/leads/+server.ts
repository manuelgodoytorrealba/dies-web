// src/routes/api/leads/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { supabasePublic } from '$lib/server/supabase';

const LEADS_TABLE = 'leads';

export async function POST(event: RequestEvent) {
  const { request, url } = event;

  try {
    const body = await request.json();

    // Info cliente que ya puedes mandar desde el front si quieres
    const {
      product_id,
      talla,
      product_slug,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign
    } = body;

    const referer = request.headers.get('referer') ?? null;

    const payload = {
      product_id: product_id ?? null,
      size: talla ?? null,
      channel: 'whatsapp',
      status: 'new',

      // Analítica básica
      product_slug: product_slug ?? null,
      source_page: source_page ?? url.pathname,
      referer,
      utm_source: utm_source ?? url.searchParams.get('utm_source'),
      utm_medium: utm_medium ?? url.searchParams.get('utm_medium'),
      utm_campaign: utm_campaign ?? url.searchParams.get('utm_campaign'),

      // cosas que de momento no usamos
      user_id: null,
      phone: null,
      name: null,
      notes: null
    };

    const { error } = await supabasePublic.from(LEADS_TABLE).insert(payload);

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