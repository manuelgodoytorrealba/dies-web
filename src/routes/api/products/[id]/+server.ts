// src/routes/api/products/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getProductById, updateProduct } from '$lib/server/db-repo';

export async function GET({ params }) {
	try {
		const product = await getProductById(params.id);

		if (!product) {
			return json({ ok: false, message: 'Product not found' }, { status: 404 });
		}

		return json(product);
	} catch (err) {
		console.error('[api/products/[id] GET]', err);
		return json({ ok: false, message: 'Error fetching product' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
	try {
		const patch = await request.json().catch(() => ({}));

		if (!patch || typeof patch !== 'object') {
			return json({ ok: false, message: 'Invalid payload' }, { status: 400 });
		}

		// Solo actualizamos los campos permitidos
		const allowedFields = ['stock', 'status_producto', 'published'];
		const updateData: any = {};

		for (const key of allowedFields) {
			if (key in patch) updateData[key] = patch[key];
		}

		if (Object.keys(updateData).length === 0) {
			return json({ ok: false, message: 'No valid fields to update' }, { status: 400 });
		}

		await updateProduct(params.id, updateData);

		return json({ ok: true });
	} catch (err) {
		console.error('[api/products/[id] PATCH]', err);
		return json({ ok: false, message: 'Error updating product' }, { status: 500 });
	}
}