// src/routes/api/products/+server.ts
import { json } from '@sveltejs/kit';
import { getProducts } from '$lib/server/db-repo';

export async function GET() {
  try {
    const products = await getProducts();
    return json(products);
  } catch (err) {
    console.error('[api/products GET]', err);
    return json({ message: 'Error fetching products' }, { status: 500 });
  }
}