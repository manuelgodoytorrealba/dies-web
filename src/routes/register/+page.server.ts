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

    if (!email || !password) {
      return fail(400, { error: 'Faltan campos', email });
    }

    if (password !== confirm) {
      return fail(400, { error: 'Las contraseñas no coinciden', email });
    }

    const { error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/login'
      }
    });

    if (error) {
      return fail(400, { error: error.message, email });
    }

    return {
      success: true,
      email
    };
  }
};