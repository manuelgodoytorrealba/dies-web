// src/routes/api/products/search/+server.ts
import { json } from '@sveltejs/kit';
import { searchProducts } from '$lib/server/db-repo';

export async function GET({ url }) {
  try {
    const q = url.searchParams.get('q') ?? '';
    const results = await searchProducts(q);
    return json(results);
  } catch (err) {
    console.error('[api/products/search GET]', err);
    return json({ message: 'Error searching products' }, { status: 500 });
  }
}