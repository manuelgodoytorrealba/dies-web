// src/lib/gateways/products.ts
import type { Product } from '$lib/types/product';
import type { SupabaseClient } from '@supabase/supabase-js';
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

export type CatalogModel = {
  modelo_slug: string;
  sample_product_id: string;
  sample_slug: string;
  nombre: string;
  marca: string;
  imagen_url: string | null;
  categoria: string | null;
  stock_total: number;
  tallas_disponibles: string[];
  precio_desde: string; // numeric viene como string desde Supabase
};
type CatalogFilters = {
  talla?: string | null;
  marca?: string | null;
  categoria?: string | null;
};

export async function getCatalogModels(
  supabase: SupabaseClient,
  filters: CatalogFilters = {}
) {
  let query = supabase.from('catalog_models').select('*');

  if (filters.talla) {
    // tallas_disponibles es text[]
    query = query.contains('tallas_disponibles', [filters.talla]);
  }

  if (filters.marca) {
    query = query.eq('marca', filters.marca);
  }

  if (filters.categoria) {
    query = query.eq('categoria', filters.categoria);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as CatalogModel[];
}