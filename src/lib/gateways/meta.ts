// src/lib/gateways/meta.ts
export type ProductsMeta = {
  brands: string[];
  sizes: (string | number)[];
  priceRange: { min: number; max: number };
  categories: string[];
};

export async function fetchProductsMeta(
  fetchFn: typeof fetch,
  category?: string
): Promise<ProductsMeta> {
  const url = category
    ? `/api/products/meta?category=${encodeURIComponent(category)}`
    : `/api/products/meta`;

  const res = await fetchFn(url);
  if (!res.ok) throw new Error('Failed to fetch products meta');
  return res.json();
}