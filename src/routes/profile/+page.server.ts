import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session) {
    throw redirect(303, '/login');
  }

  const user = session.user;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;

  return {
    user,
    profile: {
      full_name: (meta.full_name as string) ?? '',
      whatsapp: (meta.whatsapp as string) ?? '',
      bio: (meta.bio as string) ?? ''
    }
  };
};

export const actions: Actions = {
  update: async ({ request, locals }) => {
    const session = await locals.getSession();
    if (!session) {
      throw redirect(303, '/login');
    }

    const formData = await request.formData();
    const full_name = String(formData.get('full_name') ?? '').trim();
    const whatsapp = String(formData.get('whatsapp') ?? '').trim();
    const bio = String(formData.get('bio') ?? '').trim();

    const { data, error } = await locals.supabase.auth.updateUser({
      data: {
        full_name,
        whatsapp,
        bio
      }
    });

    if (error) {
      console.error('[profile/update]', error);
      return fail(400, {
        error: 'No se pudieron guardar los cambios',
        values: { full_name, whatsapp, bio }
      });
    }

    return {
      success: true,
      user: data.user,
      values: { full_name, whatsapp, bio }
    };
  }
};