// src/routes/api/products/meta/+server.ts
import { json } from '@sveltejs/kit';
import { getSupabasePublic } from '$lib/server/supabase';

const PRODUCTS_TABLE = 'products';

export async function GET({ url }: { url: URL }) {
	try {
		const supabase = getSupabasePublic();

		const categoryParam = url.searchParams.get('category');
		const category = categoryParam ? categoryParam.toLowerCase() : null;

		// ---------- CATEGORIES (NO se filtran por category) ----------
		const { data: catsData, error: catsError } = await supabase
			.from(PRODUCTS_TABLE)
			.select('categoria')
			.eq('published', true);

		const categories = catsError
			? ['zapatillas', 'ropa', 'accesorios']
			: Array.from(
					new Set(
						(catsData ?? [])
							.map((r: { categoria: string | null }) => r.categoria)
							.filter(Boolean)
					)
			  ).sort();

		// helper para aplicar filtro categoria SOLO a queries de meta dinámico
		const applyCategory = <T extends { eq: Function }>(q: T) =>
			category ? q.eq('categoria', category) : q;

		// ---------- BRANDS (filtradas por category) ----------
		let brandsQuery = supabase.from(PRODUCTS_TABLE).select('marca').eq('published', true);
		brandsQuery = applyCategory(brandsQuery);

		const { data: brandsData, error: brandsError } = await brandsQuery;
		if (brandsError) throw brandsError;

		const brands = Array.from(
			new Set((brandsData ?? []).map((r: { marca: string | null }) => r.marca).filter(Boolean))
		).sort();

		// ---------- SIZES (filtradas por category) ----------
		let sizesQuery = supabase.from(PRODUCTS_TABLE).select('talla').eq('published', true);
		sizesQuery = applyCategory(sizesQuery);

		const { data: sizesData, error: sizesError } = await sizesQuery;
		if (sizesError) throw sizesError;

		const sizes = Array.from(
			new Set((sizesData ?? []).map((r: { talla: string | null }) => r.talla).filter(Boolean))
		).sort((a, b) => {
			const na = Number(a);
			const nb = Number(b);
			if (Number.isNaN(na) || Number.isNaN(nb)) return String(a).localeCompare(String(b));
			return na - nb;
		});

		// ---------- PRICE RANGE (filtradas por category) ----------
		let pricesQuery = supabase.from(PRODUCTS_TABLE).select('precio_publicado').eq('published', true);
		pricesQuery = applyCategory(pricesQuery);

		const { data: pricesData, error: pricesError } = await pricesQuery;
		if (pricesError) throw pricesError;

		const prices = (pricesData ?? [])
			.map((r: { precio_publicado: string | null }) => Number(r.precio_publicado))
			.filter((n) => !Number.isNaN(n));

		const minPrice = prices.length ? Math.min(...prices) : 0;
		const maxPrice = prices.length ? Math.max(...prices) : 0;

		return json({
			categories, // siempre completas
			brands, // filtradas por category
			sizes, // filtradas por category
			priceRange: { min: minPrice, max: maxPrice }
		});
	} catch (err) {
		console.error('[api/products/meta GET]', err);
		return json({ message: 'Error fetching meta' }, { status: 500 });
	}
}