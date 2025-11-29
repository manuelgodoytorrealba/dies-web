// src/routes/admin/products/new/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

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
  } = body as {
    slug: string;
    nombre: string;
    descripcion?: string;
    marca: string;
    precio_publicado: number;
    talla?: string;
    imagen_url?: string;
    categoria?: string;
    stock?: number;
  };

  // Seguridad básica
  if (!slug || !nombre || !marca) {
    return json(
      { error: 'Slug, nombre y marca son obligatorios.' },
      { status: 400 }
    );
  }

  // 🔧 modelo_slug: base del modelo sin la talla al final
  const baseSlug = slug.toString();
  const slugParts = baseSlug.split('-');
  const lastPart = slugParts[slugParts.length - 1];

  const isSize = /^\d+$/.test(lastPart);
  const modelo_slug = isSize
    ? slugParts.slice(0, -1).join('-') || baseSlug
    : baseSlug;

  const { data, error: dbError } = await supabase
    .from('products')
    .insert([
      {
        slug,
        modelo_slug,
        nombre,
        descripcion,
        marca,
        precio_publicado,
        talla,
        imagen_url,
        categoria,
        stock,
        status_producto: 'disponible',
        published: false
      }
    ])
    .select('product_id, slug, nombre')
    .single();

  if (dbError || !data) {
    console.error('[admin/createProduct]', dbError);
    return json(
      { error: dbError?.message ?? 'No se pudo crear el producto' },
      { status: 500 }
    );
  }

  // el frontend espera json.product.product_id
  return json({ product: data });
};