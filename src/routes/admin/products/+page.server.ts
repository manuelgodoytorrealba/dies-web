// src/routes/admin/products/+page.server.ts
import type { PageServerLoad } from '../../$types';
import type { Product } from '$lib/types/product';

export const load = (async ({ locals }) => {
  const supabase = locals.supabase;

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin products:', error);
    return {
      products: [] as Product[]
    };
  }

  return {
    products: (products ?? []) as Product[]
  };
}) satisfies PageServerLoad;