// src/routes/admin/products/new/+server.ts
import { json, error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const body = await request.json();

  const {
    slug,
    nombre,
    descripcion,
    marca,
    precio_publicado,
    talla,
    imagen_url,
    categoria,
    stock
  } = body;

  const { data, error: dbError } = await supabase
    .from('products')
    .insert([
      {
        slug,
        nombre,
        descripcion,
        marca,
        precio_publicado,
        talla,
        imagen_url,
        categoria,
        stock,
        published: false
      }
    ])
    // 👇 aquí nos aseguramos de traer el product_id
    .select('product_id, slug, nombre')
    .single();

  if (dbError || !data) {
    console.error('[admin/createProduct]', dbError);
    throw error(500, dbError?.message ?? 'No se pudo crear el producto');
  }

  // el frontend espera json.product.product_id
  return json({ product: data });
};