// src/routes/(app)/product/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import {
  getProductById,
  getProductImages,
  getProductVariants
} from '$lib/server/db-repo';

export const load: PageServerLoad = async ({ params }) => {
  const productId = params.id;

  // 1) Producto
  const product = await getProductById(productId);
  if (!product) {
    return {
      status: 302,
      redirect: '/catalog'
    } as any;
  }

  // 2) Imágenes
  const images = await getProductImages(productId);

  // 3) TALLAS DEL MISMO MODELO
  const variants = await getProductVariants(product.modelo_slug);

  return {
    product,
    images,
    variants
  };
};