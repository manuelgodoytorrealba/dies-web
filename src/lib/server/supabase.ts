// src/lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export function getSupabasePublic() {
  const url = publicEnv.PUBLIC_SUPABASE_URL;
  const anon = publicEnv.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) throw new Error('Missing Supabase public credentials');

  return createClient(url, anon);
}

export function getSupabaseAdmin() {
  const url = publicEnv.PUBLIC_SUPABASE_URL;
  const service = privateEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) throw new Error('Missing Supabase service role credentials');

  return createClient(url, service, {
    auth: { persistSession: false }
  });
}