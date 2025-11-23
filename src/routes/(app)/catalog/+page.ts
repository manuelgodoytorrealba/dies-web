// src/routes/(app)/catalog/+page.ts
import type { PageLoad } from './$types';
import { fetchProducts } from '$lib/gateways/products';

export const load: PageLoad = async ({ fetch }) => {
  const products = await fetchProducts(fetch);

  return { products };
};