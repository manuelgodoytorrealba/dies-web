import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const GET = async () => {
  try {
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from('products') // pon aquí una tabla REAL que exista
      .select('slug')
      .limit(1);

    if (error) {
      return json({ ok: false, where: 'query', message: error.message }, { status: 500 });
    }

    return json({ ok: true, sample: data?.[0]?.slug ?? null });
  } catch (e: any) {
    return json({ ok: false, where: 'catch', message: e?.message ?? 'unknown' }, { status: 500 });
  }
};