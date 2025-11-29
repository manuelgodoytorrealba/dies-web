// src/routes/admin/stock/+page.server.ts
import type { PageServerLoad } from './$types';
import { getStockRows } from '$lib/server/db-repo';

export const load: PageServerLoad = async () => {
  const items = await getStockRows();

  return {
    items
  };
};