// src/routes/admin/+layout.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Lista de correos que pueden entrar al /admin
const ADMIN_EMAILS = ['manuelgodoyvzla@gmail.com'];

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // 1. Miramos la sesión que ya montaste en hooks.server
  const session = await locals.getSession();

  // 2. Si NO hay sesión → mandamos a login
  if (!session) {
    // opcional: param ?redirect para que luego vuelvas al admin
    const redirectTo = `/login?redirect=${encodeURIComponent(url.pathname)}`;
    throw redirect(302, redirectTo);
  }

  const email = session.user.email ?? '';

  // 3. Si el usuario está logueado pero no es admin → 403 o redirect a /catalog
  if (!ADMIN_EMAILS.includes(email)) {
    // Opción A: simplemente lo echamos al catálogo
    throw redirect(302, '/catalog');

    // Opción B (si prefieres ver un error):
    // throw error(403, 'No tienes permiso para acceder a esta zona.');
  }

  // 4. Si todo ok, devolvemos sesión y user al layout/page
  return {
    session,
    user: session.user
  };
};