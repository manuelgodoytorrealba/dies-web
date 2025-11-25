// src/routes/admin/products/upload-image/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

const BUCKET = 'productos';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return json({ error: 'Archivo inválido' }, { status: 400 });
    }

    // nombre de archivo seguro
    const originalName = file.name || 'image.jpg';
    const safeName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.\-_]/g, '');

    const path = `admin/${Date.now()}-${safeName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });

    if (error || !data) {
      console.error('[upload-image] Supabase error:', error);
      return json(
        { error: error?.message ?? 'Error subiendo la imagen' },
        { status: 500 }
      );
    }

    // Sacamos la URL pública del archivo
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error('[upload-image] Unexpected error:', err);
    return json({ error: 'Error inesperado al subir la imagen' }, { status: 500 });
  }
};