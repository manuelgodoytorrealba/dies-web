// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';

export const handle: Handle = async ({ event, resolve }) => {
  // Cliente de Supabase para el server (usa cookies de SvelteKit)
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => event.cookies.get(name),
      set: (name, value, options) => {
        event.cookies.set(name, value, {
          ...(options ?? {}),
          path: options?.path ?? '/' // MUY importante para que la cookie sirva en toda la app
        });
      },
      remove: (name, options) => {
        event.cookies.delete(name, {
          ...(options ?? {}),
          path: options?.path ?? '/'
        });
      }
    }
  });

  // Guardamos el cliente en locals
  event.locals.supabase = supabase;

  // Helper para obtener la sesión en cualquier load/action del server
  event.locals.getSession = async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[hooks.getSession] error', error);
      return null;
    }
    return data.session;
  };

  // Guardamos también el user para el layout global
  const session = await event.locals.getSession();
  event.locals.user = (session?.user as User) ?? null;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // Recomendado por Supabase para no enviar cabeceras internas
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};