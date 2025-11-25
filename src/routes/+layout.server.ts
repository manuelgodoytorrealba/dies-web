// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  const user = locals.user; // ya lo rellenamos en hooks

  return { session, user };
};