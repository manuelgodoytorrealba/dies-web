<script lang="ts">
	import ImageUploader from '$lib/components/catalog/ImageUploader.svelte';

	let slug = '';
	let nombre = '';
	let descripcion = '';
	let marca = '';
	let precio_publicado = '';
	let talla = '';
	let categoria = '';
	let stock = '1';
	let imagen_url = '';

	let loading = false;
	let errorMsg = '';
	let successMsg = '';

	let productId: string | null = null;
	let lastImageUrl = '';

	async function crearProducto() {
		loading = true;
		errorMsg = '';
		successMsg = '';

		const res = await fetch('/admin/products/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				slug,
				nombre,
				descripcion,
				marca,
				precio_publicado: Number(precio_publicado || 0),
				talla,
				imagen_url,
				categoria,
				stock: Number(stock || 0)
			})
		});

		const json = await res.json().catch(() => ({}) as any);
		loading = false;

		if (!res.ok) {
			errorMsg = json.error ?? 'Error desconocido al crear el producto';
			return;
		}

		productId = json.product?.product_id ?? null;

		if (!productId) {
			errorMsg = 'No se devolvió ningún product_id desde el servidor.';
			return;
		}

		successMsg = 'Producto creado correctamente. Ahora puedes subir imágenes.';
	}

	import { goto } from '$app/navigation';

	async function handleImageUploaded(event: CustomEvent<{ url: string }>) {
		lastImageUrl = event.detail.url;

		// Si no había portada, asigna la primera
		if (!imagen_url) {
			imagen_url = event.detail.url;
		}

		// Espera un poquito para mostrar la preview (opcional)
		await new Promise((r) => setTimeout(r, 600));

		// Redirige al listado de productos
		goto('/admin/products');
	}
</script>

<section class="new-product">
	<h1>Nuevo producto</h1>

	<form on:submit|preventDefault={crearProducto} class="card">
		<label>Slug <input bind:value={slug} required /></label>
		<label>Nombre <input bind:value={nombre} required /></label>
		<label>Descripción <textarea rows="3" bind:value={descripcion}></textarea></label>
		<label>Marca <input bind:value={marca} required /></label>
		<label
			>Categoría <input
				bind:value={categoria}
				placeholder="zapatillas / ropa / accesorios"
			/></label
		>
		<label
			>Precio publicado (€)<input
				type="number"
				bind:value={precio_publicado}
				min="0"
				step="0.01"
			/></label
		>
		<label>Talla <input bind:value={talla} /></label>
		<label>Stock <input type="number" bind:value={stock} min="0" /></label>
		<label>Imagen URL (opcional)<input bind:value={imagen_url} /></label>

		{#if errorMsg}<p class="error">{errorMsg}</p>{/if}
		{#if successMsg}<p class="success">{successMsg}</p>{/if}

		<button disabled={loading}>{loading ? 'Guardando...' : 'Crear'}</button>
	</form>

	{#if productId}
		<section class="gallery">
			<h2>Imágenes del producto</h2>
			<p class="hint">
				Sube imagen. La imagen se usará como portada si
				<code>imagen_url</code> está vacío.
			</p>

			<ImageUploader
				bind:imageUrl={lastImageUrl}
				{productId}
				bucket="productos"
				folder={`admin/${productId}`}
				on:uploaded={handleImageUploaded}
			/>

			{#if lastImageUrl}
				<p class="small">Última imagen subida:</p>
				<img class="preview" src={lastImageUrl} alt="Previsualización" />
			{/if}
		</section>
	{:else}
		<p class="hint">Guarda primero el producto para poder subir imágenes.</p>
	{/if}
</section>

<style>
	.new-product {
		padding: 24px;
		max-width: 720px;
		margin: auto;
	}
	.card {
		border: 1px solid #ddd;
		border-radius: 14px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: #fff;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-weight: 600;
		font-size: 14px;
	}
	input,
	textarea {
		padding: 8px 10px;
		border-radius: 10px;
		border: 1px solid #444;
		font-size: 14px;
	}
	button {
		padding: 10px;
		border-radius: 10px;
		border: none;
		background: #111;
		color: #fff;
		cursor: pointer;
		font-weight: 700;
	}
	.error {
		color: #b00020;
	}
	.success {
		color: #0a8a0a;
	}
	.gallery {
		margin-top: 32px;
		border-top: 1px solid #eee;
		padding-top: 16px;
	}
	.hint {
		margin-top: 12px;
		font-size: 13px;
		opacity: 0.7;
	}
	.small {
		font-size: 13px;
	}
	.preview {
		margin-top: 8px;
		max-width: 240px;
		border-radius: 10px;
		border: 1px solid #ddd;
	}
</style>
