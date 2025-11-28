// src/routes/login/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	// Si ya está logado, lo mandamos al catálogo directamente
	if (session) {
		throw redirect(302, '/catalog');
	}

	// Es importante devolver algo, aunque sea vacío
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '');
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, {
				error: 'Email y contraseña son obligatorios',
				email
			});
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('[login] error', error);
			return fail(400, {
				error: 'Email o contraseña incorrectos',
				email
			});
		}

		console.log('[login] usuario logado:', data.session?.user?.email);

		// redirige al catálogo
		throw redirect(303, '/catalog');
	}
};