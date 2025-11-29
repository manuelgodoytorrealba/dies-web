import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (session) {
    throw redirect(302, '/catalog');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm') ?? '');
    const full_name = String(formData.get('full_name') ?? '');
    const whatsapp = String(formData.get('whatsapp') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Faltan campos', email, values: { full_name, whatsapp } });
    }

    if (password !== confirm) {
      return fail(400, {
        error: 'Las contraseñas no coinciden',
        email,
        values: { full_name, whatsapp }
      });
    }

    const { error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/login',
        data: {
          full_name,
          whatsapp
        }
      }
    });

    if (error) {
      return fail(400, { error: error.message, email, values: { full_name, whatsapp } });
    }

    return {
      success: true,
      email
    };
  }
};