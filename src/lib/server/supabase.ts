// src/lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

const PUBLIC_SUPABASE_URL = publicEnv.PUBLIC_SUPABASE_URL!;
const PUBLIC_SUPABASE_ANON_KEY = publicEnv.PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = privateEnv.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente público (anon) -> seguro para lecturas con RLS
export const supabasePublic = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);

// Cliente privado (service role) -> bypass de RLS, SOLO servidor
export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);