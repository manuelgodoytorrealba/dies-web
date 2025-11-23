// src/lib/server/db-repo.ts
import { supabasePublic, supabaseAdmin } from './supabase';

const PRODUCTS_TABLE = 'products';

// Columnas reales
const ID_COL = 'product_id';
const NAME_COL = 'nombre';
const DESC_COL = 'descripcion';
const BRAND_COL = 'marca';
const SLUG_COL = 'slug';

/**
 * Normaliza errores de Supabase a un formato simple.
 */
function handleError(context: string, error: unknown) {
  console.error(`[db-repo] ${context}`, error);
  throw new Error(`Database error in ${context}`);
}

/**
 * Obtener TODOS los productos publicados (catálogo).
 */
export async function getProducts() {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) handleError('getProducts', error);
  return data ?? [];
}

/**
 * Obtener un producto por product_id.
 */
export async function getProductById(id: string) {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq(ID_COL, id)
    .single();

  if (error) handleError('getProductById', error);
  return data;
}

/**
 * Obtener un producto por slug.
 * (Esto te viene brutal para rutas limpias luego)
 */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq(SLUG_COL, slug)
    .single();

  if (error) handleError('getProductBySlug', error);
  return data;
}

/**
 * Obtener productos por marca (filtro).
 */
export async function getProductsByBrand(brand: string) {
  const b = brand.trim();
  if (!b) return [];

  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .ilike(BRAND_COL, `%${b}%`)          // 👈 case-insensitive exact match
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) handleError('getProductsByBrand', error);
  return data ?? [];
}

/**
 * Buscar productos por nombre o descripción.
 */
export async function searchProducts(query: string) {
  const q = query.trim();
  if (!q) return [];

  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .or(
      `${NAME_COL}.ilike.%${q}%,` +
      `${DESC_COL}.ilike.%${q}%,` +
      `${BRAND_COL}.ilike.%${q}%,` +
      `${SLUG_COL}.ilike.%${q}%`
    )
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) handleError('searchProducts', error);
  return data ?? [];
}

/**
 * Crear producto (solo admin).
 */
export async function createProduct(payload: Record<string, any>) {
  const { data, error } = await supabaseAdmin
    .from(PRODUCTS_TABLE)
    .insert(payload)
    .select('*')
    .single();

  if (error) handleError('createProduct', error);
  return data;
}

/**
 * Actualizar producto (solo admin).
 */
export async function updateProduct(id: string, patch: Record<string, any>) {
  const { data, error } = await supabaseAdmin
    .from(PRODUCTS_TABLE)
    .update(patch)
    .eq(ID_COL, id)
    .select('*')
    .single();

  if (error) handleError('updateProduct', error);
  return data;
}

/**
 * Borrar producto (solo admin).
 */
export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from(PRODUCTS_TABLE)
    .delete()
    .eq(ID_COL, id);

  if (error) handleError('deleteProduct', error);
  return true;
}