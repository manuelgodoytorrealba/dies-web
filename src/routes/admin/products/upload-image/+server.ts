// src/routes/admin/products/upload-image/+server.ts
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
	const supabase = getSupabaseAdmin();

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

	const ext = file.name.split('.').pop() || 'jpg';
	const fileName = `${crypto.randomUUID()}.${ext}`;
	const path = folder ? `${folder}/${fileName}` : fileName;

	// 1) Subir al bucket
	const { data, error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
		cacheControl: '3600',
		upsert: false
	});

	if (uploadError || !data) {
		console.error('[upload-image] upload error', uploadError);
		throw error(500, 'No se pudo subir la imagen a storage');
	}

	// 2) URL pública
	const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
	const publicUrl = publicData.publicUrl;

	// 3) Calcular orden siguiente
	const { data: existing } = await supabase
		.from('product_images')
		.select('orden')
		.eq('product_id', productId)
		.order('orden', { ascending: false })
		.limit(1);

	const nextOrden = existing && existing.length ? (existing[0].orden ?? 0) + 1 : 0;

	// 4) Insertar en product_images
	const { data: inserted, error: insertError } = await supabase
		.from('product_images')
		.insert({
			product_id: productId,
			url: publicUrl,
			orden: nextOrden
		})
		.select('id')
		.single();

	if (insertError || !inserted) {
		console.error('[upload-image] insert error', insertError);
		throw error(500, 'No se pudo registrar la imagen en product_images');
	}

	// 5) Si el producto no tiene imagen_url, usar esta como portada
	const { data: product, error: productError } = await supabase
		.from('products')
		.select('imagen_url')
		.eq('product_id', productId)
		.single();

	if (!productError && (!product?.imagen_url || product.imagen_url === '')) {
		await supabase
			.from('products')
			.update({ imagen_url: publicUrl })
			.eq('product_id', productId);
	}

	return json({ url: publicUrl, id: inserted.id });
};