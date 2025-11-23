// src/routes/api/products/brand/[brand]/+server.ts
import { json } from '@sveltejs/kit';
import { getProductsByBrand } from '$lib/server/db-repo';

export async function GET({ params }) {
  try {
    const brand = params.brand;
    const products = await getProductsByBrand(brand);
    return json(products);
  } catch (err) {
    console.error('[api/products/brand/[brand] GET]', err);
    return json({ message: 'Error fetching products by brand' }, { status: 500 });
  }
}