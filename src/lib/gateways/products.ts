// src/lib/gateways/products.ts
import type { Product } from '$lib/types/product';

type FetchFn = typeof fetch;

/**
 * Obtener todos los productos
 */
export async function fetchProducts(fetchFn: FetchFn): Promise<Product[]> {
  const res = await fetchFn('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

/**
 * Obtener producto por id
 */
export async function fetchProductById(fetchFn: FetchFn, id: string): Promise<Product> {
  const res = await fetchFn(`/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

/**
 * Buscar productos
 */
export async function searchProducts(fetchFn: FetchFn, query: string): Promise<Product[]> {
  const res = await fetchFn(`/api/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search products');
  return res.json();
}

/**
 * Productos por marca
 */
export async function fetchProductsByBrand(fetchFn: FetchFn, brand: string): Promise<Product[]> {
  const res = await fetchFn(`/api/products/brand/${brand}`);
  if (!res.ok) throw new Error('Failed to fetch products by brand');
  return res.json();
}