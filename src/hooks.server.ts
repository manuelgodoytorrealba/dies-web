// src/hooks.server.ts
// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import { env as publicEnv } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';

const PUBLIC_SUPABASE_URL = publicEnv.PUBLIC_SUPABASE_URL!;
const PUBLIC_SUPABASE_ANON_KEY = publicEnv.PUBLIC_SUPABASE_ANON_KEY!;

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => event.cookies.get(name),
      set: (name, value, options) => {
        event.cookies.set(name, value, {
          ...(options ?? {}),
          path: options?.path ?? '/'
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

  event.locals.supabase = supabase;

  let session: Session | null = null;
  let user: User | null = null;

  // ✅ Intentamos obtener el usuario validado
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // ⚠️ Si no hay sesión (status 400), lo ignoramos: usuario deslogueado
      const status = (error as any).status;
      if (status !== 400) {
        console.error('[hooks] getUser error', error);
      }
    } else {
      user = (data?.user as User) ?? null;
    }
  } catch (err: any) {
    const status = err?.status;
    if (status !== 400) {
      console.error('[hooks] unexpected getUser error', err);
    }
  }

  // Guardamos en locals
  event.locals.session = session;
  event.locals.user = user;

  // Helper opcional, por si algún sitio aún usa getSession()
  event.locals.getSession = async (): Promise<Session | null> => {
    if (session) return session;

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        const status = (error as any).status;
        if (status !== 400) {
          console.error('[hooks] getSession error', error);
        }
        return null;
      }

      session = data.session;
      event.locals.session = session;
      return session;
    } catch (err: any) {
      const status = err?.status;
      if (status !== 400) {
        console.error('[hooks] unexpected getSession error', err);
      }
      return null;
    }
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};