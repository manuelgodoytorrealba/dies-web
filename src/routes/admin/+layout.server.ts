// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const ADMINS = ['manuelgodoyvzla@gmail.com']; // tu email admin

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;
  const email = user?.email ?? '';

  if (!user || !ADMINS.includes(email)) {
    throw redirect(302, '/catalog');
  }

  return { user };
};