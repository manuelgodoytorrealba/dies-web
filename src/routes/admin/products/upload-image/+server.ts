// src/routes/admin/products/upload-image/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();

  const file = formData.get('file');
  const productId = formData.get('product_id')?.toString();
  const bucket = (formData.get('bucket')?.toString() || 'productos') as string;
  const folder = formData.get('folder')?.toString() || '';

  if (!(file instanceof File)) {
    throw error(400, 'Falta el archivo');
  }

  if (!productId) {
    throw error(400, 'Falta product_id');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw error(400, 'Formato no permitido. Usa JPG, PNG o WEBP.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw error(400, 'La imagen no puede superar los 5MB.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = folder ? `${folder}/${fileName}` : fileName;

  // 1) Subir al bucket de Storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError || !uploadData) {
    console.error('[upload-image] upload error', uploadError);
    throw error(500, 'No se pudo subir la imagen a storage');
  }

  // 2) Obtener URL pública
  const { data: publicData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(uploadData.path);

  const publicUrl = publicData.publicUrl;

  // 3) Calcular siguiente orden para este producto
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('product_images')
    .select('orden')
    .eq('product_id', productId);

  if (existingError) {
    console.error('[upload-image] existing images error', existingError);
  }

  const nextOrden =
    existing && existing.length
      ? Math.max(...existing.map((img) => img.orden ?? 0)) + 1
      : 0;

  // 4) Insertar en tabla product_images
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('product_images')
    .insert({
      product_id: productId,
      url: publicUrl,
      orden: nextOrden
    })
    .select('id, url, orden')
    .single();

  if (insertError || !inserted) {
    console.error('[upload-image] insert error', insertError);
    throw error(500, 'No se pudo registrar la imagen en product_images');
  }

  return json({
    url: inserted.url,
    id: inserted.id,
    orden: inserted.orden
  });
};