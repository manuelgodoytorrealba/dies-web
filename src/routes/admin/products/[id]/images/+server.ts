// src/routes/admin/products/[id]/images/+server.ts
import type { RequestHandler } from './$types';
import { json, redirect } from '@sveltejs/kit';
import { addProductImage, deleteProductImage } from '$lib/server/db-repo';

const ADMINS = ['manuelgodoyvzla@gmail.com']; // mismo criterio que en /admin

async function assertAdmin(locals: App.Locals) {
  const session = await locals.getSession();
  const email = session?.user?.email ?? '';
  if (!session || !ADMINS.includes(email)) {
    throw redirect(302, '/catalog');
  }
}

// 👉 Añadir imagen a la galería
export const POST: RequestHandler = async ({ params, request, locals }) => {
  await assertAdmin(locals);

  const productId = params.id;
  const { url } = await request.json();

  if (!url || typeof url !== 'string') {
    return json({ message: 'URL inválida' }, { status: 400 });
  }

  try {
    const image = await addProductImage(productId, url);
    return json({ image }, { status: 201 });
  } catch (err) {
    console.error('[admin/images POST]', err);
    return json({ message: 'No se pudo guardar la imagen' }, { status: 500 });
  }
};

// 👉 Eliminar imagen de la galería
export const DELETE: RequestHandler = async ({ request, locals }) => {
  await assertAdmin(locals);

  const { id } = await request.json();
  if (!id || typeof id !== 'string') {
    return json({ message: 'ID inválido' }, { status: 400 });
  }

  try {
    await deleteProductImage(id);
    return json({ success: true });
  } catch (err) {
    console.error('[admin/images DELETE]', err);
    return json({ message: 'No se pudo borrar la imagen' }, { status: 500 });
  }
};