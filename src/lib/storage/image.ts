// src/lib/storage/images.ts
import { supabaseBrowser } from '$lib/supabase-browser';

const BUCKET = 'product-images';

/**
 * Sube una imagen al bucket y devuelve la URL pública.
 * slugOrId: lo usamos para organizar los ficheros por producto.
 */
export async function uploadProductImage(file: File, slugOrId: string): Promise<string> {
  if (!file) throw new Error('No file provided');
  if (!slugOrId) throw new Error('slugOrId is required');

  // Detectar extensión
  const originalName = file.name.toLowerCase();
  const ext = originalName.split('.').pop() || 'jpg';

  // Nombre único para evitar colisiones de cache
  const fileName = `${slugOrId}-${Date.now()}.${ext}`;
  const filePath = `${slugOrId}/${fileName}`;

  // Subir archivo
  const { data, error } = await supabaseBrowser.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('[uploadProductImage] upload error', error);
    throw error;
  }

  // Obtener URL pública
  const { data: publicData } = supabaseBrowser.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return publicData.publicUrl;
}