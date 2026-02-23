import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const GET = async () => {
  const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase
    .from('products') // usa tu tabla más pequeña
    .select('id')
    .limit(1);

  if (error) {
    return json({ ok: false }, { status: 500 });
  }

  return json({ ok: true });
};