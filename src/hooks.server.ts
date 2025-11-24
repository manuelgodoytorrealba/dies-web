import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return event.cookies.get(name);
        },
        set(name, value, options) {
          event.cookies.set(name, value, {
            ...options,
            path: options?.path ?? '/' // <- FIX CLAVE
          });
        },
        remove(name, options) {
          event.cookies.delete(name, {
            ...options,
            path: options?.path ?? '/' // <- FIX CLAVE
          });
        }
      }
    }
  );

  event.locals.supabase = supabase;

  // helper opcional por si lo quieres usar en rutas
  event.locals.getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

declare module '@sveltejs/kit' {
  interface Locals {
    supabase: ReturnType<typeof createServerClient>;
    getSession: () => Promise<import('@supabase/supabase-js').Session | null>;
  }
}