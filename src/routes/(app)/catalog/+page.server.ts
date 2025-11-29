// src/routes/(app)/catalog/+page.server.ts
import type { PageServerLoad } from './$types';
import { getCatalogModels } from '$lib/gateways/products';

export const load: PageServerLoad = async ({ locals, url }) => {
  const supabase = locals.supabase;

  // filtros desde la URL ?talla=42&marca=Nike&categoria=zapatillas
  const talla = url.searchParams.get('talla');
  const marca = url.searchParams.get('marca');
  const categoria = url.searchParams.get('categoria');

  const models = await getCatalogModels(supabase, {
    talla: talla || undefined,
    marca: marca || undefined,
    categoria: categoria || undefined
  });

  return {
    models,
    filters: {
      talla,
      marca,
      categoria
    }
  };
};