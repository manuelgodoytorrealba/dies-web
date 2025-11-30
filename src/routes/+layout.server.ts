// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // El hook ya puso session y user en locals
  return {
    session: locals.session,
    user: locals.user
  };
};