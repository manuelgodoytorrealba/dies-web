// src/routes/admin/products/[id]/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImages
} from '$lib/server/db-repo';

const ADMINS = ['manuelgodoyvzla@gmail.com']; // tu lista de admins

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.getSession();
  const email = session?.user?.email ?? '';

  if (!session || !ADMINS.includes(email)) {
    throw redirect(302, '/catalog');
  }

  try {
    const product = await getProductById(params.id);

    if (!product) {
      throw redirect(303, '/admin/products');
    }

    const images = await getProductImages(params.id);

    return { product, images };
  } catch (err) {
    console.error('[admin/getProductById]', err);
    throw redirect(303, '/admin/products');
  }
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const session = await locals.getSession();
    const email = session?.user?.email ?? '';

    if (!session || !ADMINS.includes(email)) {
      throw redirect(302, '/catalog');
    }

    const form = await request.formData();
    const intent = String(form.get('intent') ?? 'save');

    // 🗑️ Eliminar
    if (intent === 'delete') {
      try {
        await deleteProduct(params.id);
        throw redirect(303, '/admin/products');
      } catch (err) {
        console.error('[admin/deleteProduct]', err);
        return fail(500, { message: 'No se pudo eliminar el producto' });
      }
    }

    // 💾 Guardar / actualizar
    const slug = form.get('slug')?.toString().trim() || null;
    const nombre = form.get('nombre')?.toString().trim() || '';
    const descripcion = form.get('descripcion')?.toString().trim() || '';
    const marca = form.get('marca')?.toString().trim() || '';
    const talla = form.get('talla')?.toString().trim() || '';
    const imagen_url = form.get('imagen_url')?.toString().trim() || '';
    const categoria = form.get('categoria')?.toString().trim() || null;
    const precio_publicado = Number(form.get('precio_publicado') || 0);
    const stock = Number(form.get('stock') || 0);
    const published = form.get('published') === 'on';

    if (!nombre || !marca) {
      return fail(400, {
        message: 'Nombre y marca son obligatorios',
        values: {
          slug,
          nombre,
          descripcion,
          marca,
          precio_publicado,
          talla,
          imagen_url,
          categoria,
          stock,
          published
        }
      });
    }

    try {
      await updateProduct(params.id, {
        slug,
        nombre,
        descripcion,
        marca,
        precio_publicado,
        talla,
        imagen_url,
        categoria,
        stock,
        published
      });

      throw redirect(303, '/admin/products');
    } catch (err) {
      console.error('[admin/updateProduct]', err);
      return fail(500, { message: 'No se pudo guardar el producto' });
    }
  }
};