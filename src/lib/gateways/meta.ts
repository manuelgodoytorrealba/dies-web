// src/lib/gateways/meta.ts
export type ProductsMeta = {
  brands: string[];
  sizes: (string | number)[];
  priceRange: { min: number; max: number };
  categories: string[];
};

type FetchFn = typeof fetch;

export async function fetchProductsMeta(fetchFn: FetchFn): Promise<ProductsMeta> {
  const res = await fetchFn('/api/products/meta');
  if (!res.ok) throw new Error('Failed to fetch products meta');
  return res.json();
}