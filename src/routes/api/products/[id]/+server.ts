
// src/routes/api/products/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getProductById } from '$lib/server/db-repo';

export async function GET({ params }) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return json({ message: 'Product not found' }, { status: 404 });
    }

    return json(product);
  } catch (err) {
    console.error('[api/products/[id] GET]', err);
    return json({ message: 'Error fetching product' }, { status: 500 });
  }
}