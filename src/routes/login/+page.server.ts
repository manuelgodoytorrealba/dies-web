import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log("server login data", data);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  }
};