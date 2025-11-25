// src/routes/admin/products/new/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';

const ADMINS = ['manuelgodoyvzla@gmail.com']; // tus correos admin

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const supabase = locals.supabase;

    // proteger ruta
    const session = await locals.getSession();
    const email = session?.user?.email ?? '';

    if (!session || !ADMINS.includes(email)) {
      throw redirect(303, '/catalog');
    }

    const form = await request.formData();

    const slug = form.get('slug')?.toString().trim() ?? '';
    const nombre = form.get('nombre')?.toString().trim() ?? '';
    const descripcion = form.get('descripcion')?.toString().trim() ?? '';
    const marca = form.get('marca')?.toString().trim() ?? '';
    const precio_publicado = Number(form.get('precio_publicado') ?? 0);
    const talla = form.get('talla')?.toString().trim() ?? '';
    const categoria = form.get('categoria')?.toString().trim() ?? '';
    const stock = Number(form.get('stock') ?? 0);
    const imagen_url = form.get('imagen_url')?.toString().trim() ?? '';
    const published = form.get('published') === 'on';

    // validación mínima
    if (!slug || !nombre || !marca) {
      return fail(400, {
        message: 'Slug, nombre y marca son obligatorios.',
        values: {
          slug, nombre, descripcion, marca,
          precio_publicado, talla, categoria,
          stock, imagen_url, published
        }
      });
    }

    // insertar en supabase
    const { data, error } = await supabase
      .from('products')
      .insert({
        slug,
        nombre,
        descripcion,
        marca,
        precio_publicado,
        talla,
        categoria,
        stock,
        imagen_url,
        published
      })
      .select('*')
      .single();

    if (error) {
      console.error('[admin/createProduct]', error);
      return fail(500, {
        message: 'No se pudo crear el producto.',
        values: {
          slug, nombre, descripcion, marca,
          precio_publicado, talla, categoria,
          stock, imagen_url, published
        }
      });
    }

    // redirigir al listado
    throw redirect(303, '/admin/products');
  }
};