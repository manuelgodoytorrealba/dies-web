// src/routes/(app)/product/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { getProductById, getProductImages } from '$lib/server/db-repo';

export const load: PageServerLoad = async ({ params }) => {
  const productId = params.id;

  // Producto
  const product = await getProductById(productId);
  if (!product) {
    // si no existe, lo mandamos al catálogo
    return {
      status: 302,
      redirect: '/catalog'
    } as any;
  }

  // Imágenes (puede devolver [])
  const images = await getProductImages(productId);

  return {
    product,
    images
  };
};