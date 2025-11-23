// src/routes/api/products/meta/+server.ts
import { json } from '@sveltejs/kit';
import { supabasePublic } from '$lib/server/supabase';

const PRODUCTS_TABLE = 'products';

export async function GET() {
  try {
    // brands
    const { data: brandsData, error: brandsError } = await supabasePublic
      .from(PRODUCTS_TABLE)
      .select('marca')
      .eq('published', true);

    if (brandsError) throw brandsError;

    const brands = Array.from(
      new Set((brandsData ?? []).map((r) => r.marca).filter(Boolean))
    ).sort();

    // sizes
    const { data: sizesData, error: sizesError } = await supabasePublic
      .from(PRODUCTS_TABLE)
      .select('talla')
      .eq('published', true);

    if (sizesError) throw sizesError;

    const sizes = Array.from(
      new Set((sizesData ?? []).map((r) => r.talla).filter(Boolean))
    ).sort((a, b) => Number(a) - Number(b));

    // price range
    const { data: pricesData, error: pricesError } = await supabasePublic
      .from(PRODUCTS_TABLE)
      .select('precio_publicado')
      .eq('published', true);

    if (pricesError) throw pricesError;

    const prices = (pricesData ?? [])
      .map((r) => Number(r.precio_publicado))
      .filter((n) => !Number.isNaN(n));

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    // categories (fallback si no existe columna)
    const { data: catsData, error: catsError } = await supabasePublic
      .from(PRODUCTS_TABLE)
      .select('categoria')
      .eq('published', true);

    const categories = catsError
      ? ['zapatillas', 'ropa', 'accesorios'] // UI list mientras metes la columna
      : Array.from(
          new Set((catsData ?? []).map((r) => r.categoria).filter(Boolean))
        ).sort();

    return json({
      brands,
      sizes,
      priceRange: { min: minPrice, max: maxPrice },
      categories
    });
  } catch (err) {
    console.error('[api/products/meta GET]', err);
    return json({ message: 'Error fetching meta' }, { status: 500 });
  }
}