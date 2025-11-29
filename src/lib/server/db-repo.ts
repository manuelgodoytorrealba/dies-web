// src/lib/server/db-repo.ts
import { supabasePublic, supabaseAdmin } from './supabase';

const PRODUCTS_TABLE = 'products';
const PRODUCT_IMAGES_TABLE = 'product_images';

// Columnas reales
const ID_COL = 'product_id';
const NAME_COL = 'nombre';
const DESC_COL = 'descripcion';
const BRAND_COL = 'marca';
const SLUG_COL = 'slug';

/**
 * Manejo simple de errores
 */
function handleError(context: string, error: unknown) {
  console.error(`[db-repo] ${context}`, error);
  throw new Error(`Database error in ${context}`);
}

/* ----------------------------------------------------------- */
/* 📦  GET PRODUCTS (CATÁLOGO)                                 */
/* ----------------------------------------------------------- */
export async function getProducts() {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) handleError('getProducts', error);
  return data ?? [];
}

/* ----------------------------------------------------------- */
/* 📦  GET PRODUCT BY ID                                        */
/* ----------------------------------------------------------- */
export async function getProductById(id: string) {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq(ID_COL, id)
    .single();

  if (error) handleError('getProductById', error);
  return data;
}

/* ----------------------------------------------------------- */
/* 📦  GET PRODUCT BY SLUG                                      */
/* ----------------------------------------------------------- */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq(SLUG_COL, slug)
    .single();

  if (error) handleError('getProductBySlug', error);
  return data;
}

/* ----------------------------------------------------------- */
/* 📦  GET PRODUCTS BY BRAND (PUBLISHED)                        */
/* ----------------------------------------------------------- */
export async function getProductsByBrand(brand: string) {
  const b = brand.trim();
  if (!b) return [];

  const { data, error } = await supabasePublic
    .from(PRODUCTS_TABLE)
    .select('*')
    .ilike(BRAND_COL, `%${b}%`)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) handleError('getProductsByBrand', error);
  return data ?? [];
}

/* ----------------------------------------------------------- */
/* 🔍  SEARCH PRODUCTS                                          */
/* ----------------------------------------------------------- */
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

/* ----------------------------------------------------------- */
/* 🛠 CREATE PRODUCT (ADMIN)                                    */
/* ----------------------------------------------------------- */
export async function createProduct(payload: Record<string, any>) {
  const finalPayload = {
    ...payload,
    published: false,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabaseAdmin
    .from(PRODUCTS_TABLE)
    .insert(finalPayload)
    .select('*')
    .single();

  if (error) handleError('createProduct', error);
  return data;
}

/* ----------------------------------------------------------- */
/* 🛠 UPDATE PRODUCT (ADMIN)                                    */
/* ----------------------------------------------------------- */
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

/* ----------------------------------------------------------- */
/* 🗑 DELETE PRODUCT + IMAGES                                   */
/* ----------------------------------------------------------- */
export async function deleteProduct(productId: string) {
  try {
    const bucket = 'productos';

    // 1) Leer imágenes asociadas
    const { data: images, error: imgError } = await supabaseAdmin
      .from('product_images')
      .select('url')
      .eq('product_id', productId);

    if (!imgError && images?.length) {
      const paths = images
        .map((img) => {
          try {
            const u = new URL(img.url);
            const marker = `/storage/v1/object/public/${bucket}/`;
            const idx = u.pathname.indexOf(marker);
            if (idx === -1) return null;
            return u.pathname.slice(idx + marker.length);
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[];

      if (paths.length) {
        await supabaseAdmin.storage.from(bucket).remove(paths);
      }
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('product_id', productId);

    if (error) handleError('deleteProduct', error);
  } catch (err) {
    console.error('[deleteProduct] unexpected', err);
    throw new Error('Database error in deleteProduct');
  }
}

/* ----------------------------------------------------------- */
/* 🖼  PRODUCT IMAGES                                            */
/* ----------------------------------------------------------- */
export async function getProductImages(productId: string) {
  const { data, error } = await supabasePublic
    .from(PRODUCT_IMAGES_TABLE)
    .select('*')
    .eq('product_id', productId)
    .order('orden', { ascending: true });

  if (error) handleError('getProductImages', error);
  return data ?? [];
}

export async function addProductImage(productId: string, url: string) {
  const { data, error } = await supabaseAdmin
    .from('product_images')
    .insert({ product_id: productId, url })
    .select('*')
    .single();

  if (error) handleError('addProductImage', error);
  return data;
}

export async function deleteProductImage(id: string) {
  const { error } = await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('id', id);

  if (error) handleError('deleteProductImage', error);
  return true;
}

/* ----------------------------------------------------------- */
/* 🔥  VARIANTES (TALLAS DE UN MISMO MODELO)                     */
/* ----------------------------------------------------------- */
export async function getProductVariants(modelo_slug: string) {
  const { data, error } = await supabasePublic
    .from('products')
    .select('product_id, talla, stock, precio_publicado')
    .eq('modelo_slug', modelo_slug)
    .eq('published', true)
    .eq('status_producto', 'disponible')
    .order('talla', { ascending: true });

  if (error) {
    console.error('[getProductVariants] error', error);
    return [];
  }

  return data ?? [];
}
// --- STOCK (vista por modelo) ---------------------------------

// Usa la vista catalog_models que ya creamos en SQL
export async function getStockOverview() {
  const { data, error } = await supabasePublic
    .from('catalog_models')
    .select('*')
    .order('marca', { ascending: true })
    .order('nombre', { ascending: true });

  if (error) {
    console.error('[db-repo/getStockOverview]', error);
    throw new Error('Database error in getStockOverview');
  }

  return data ?? [];
}

// --- LEADS ----------------------------------------------------

export async function getLeads(limit = 200) {
  // Traemos lead + datos básicos del producto asociado
  const { data, error } = await supabasePublic
    .from('leads')
    .select(
      `
      lead_id,
      product_id,
      size,
      status,
      channel,
      created_at,
      notes,
      products:product_id (
        nombre,
        marca,
        precio_publicado
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[db-repo/getLeads]', error);
    throw new Error('Database error in getLeads');
  }

  return data ?? [];
}

export async function updateLeadStatus(leadId: string, status: string) {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('lead_id', leadId);

  if (error) {
    console.error('[db-repo/updateLeadStatus]', error);
    throw new Error('Database error in updateLeadStatus');
  }

  return true;
}

// 🔹 STOCK OVERVIEW: una fila por product_id (modelo + talla)
export async function getStockRows() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(
        [
          'product_id',
          'modelo_slug',
          'nombre',
          'marca',
          'talla',
          'stock',
          'status_producto',
          'published',
          'created_at'
        ].join(',')
      )
      .order('modelo_slug', { ascending: true })
      .order('talla', { ascending: true });

    if (error) {
      handleError('getStockRows', error);
    }

    return data ?? [];
  } catch (err) {
    handleError('getStockRows', err);
  }
}