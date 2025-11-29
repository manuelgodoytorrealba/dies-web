<script lang="ts">
	import { goto } from '$app/navigation';
	import ImageUploader from '$lib/components/catalog/ImageUploader.svelte';

	let slug = '';
	let nombre = '';
	let descripcion = '';
	let marca = '';
	let precio_publicado = '';
	let talla = '';
	let categoria = 'zapatillas';
	let stock = '1';
	let imagen_url = '';

	let loading = false;
	let errorMsg = '';
	let successMsg = '';

	let productId: string | null = null;
	let lastImageUrl = '';

	// --- Crear producto base ---
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

	async function ensureProductCreated(): Promise<string | null> {
		// Si ya hay productId, no hacemos nada
		if (productId) return productId;

		// Validación mínima para no crear productos vacíos
		if (!nombre || !slug || !marca) {
			errorMsg = 'Rellena al menos Nombre, Slug y Marca antes de subir imágenes.';
			return null;
		}

		// Reutilizamos la lógica de crearProducto
		await crearProducto();

		return productId;
	}

	// --- Callback de subida de imagen ---
	async function handleImageUploaded(event: CustomEvent<{ url: string }>) {
		lastImageUrl = event.detail.url;

		// Si no había portada, asigna la primera
		if (!imagen_url) {
			imagen_url = event.detail.url;
		}

		// Pequeño delay para ver la preview
		await new Promise((r) => setTimeout(r, 600));

		// Volver al listado
		goto('/admin/products');
	}

	function goBack() {
		goto('/admin/products');
	}
</script>

<section class="new-product">
	<header class="page-header">
		<div>
			<h1>➕ Nuevo producto</h1>
			<p>Crea un producto base. Luego podrás añadir imágenes y variantes por talla.</p>
		</div>
		<button type="button" class="btn-secondary" on:click={goBack}> ← Volver a productos </button>
	</header>

	<div class="layout">
		<!-- FORMULARIO PRINCIPAL -->
		<form class="card main-card" on:submit|preventDefault={crearProducto}>
			<div class="form-grid">
				<!-- COLUMNA IZQUIERDA -->
				<div class="col">
					<div class="field-group">
						<label for="nombre">Nombre</label>
						<input
							id="nombre"
							bind:value={nombre}
							placeholder="Nike Total 90, Adidas Cabo Rojo..."
							required
						/>
					</div>

					<div class="field-group">
						<label for="slug">
							Slug
							<span class="hint-inline">URL amigable. Se autogenera desde el nombre.</span>
						</label>
						<input id="slug" bind:value={slug} placeholder="nike-total-90-42" required />
					</div>

					<div class="field-group">
						<label for="descripcion">Descripción</label>
						<textarea
							id="descripcion"
							rows="3"
							bind:value={descripcion}
							placeholder="Detalles del modelo, colorway, estado, etc."
						></textarea>
					</div>

					<div class="double-row">
						<div class="field-group">
							<label for="marca">Marca</label>
							<input id="marca" bind:value={marca} placeholder="Nike, Adidas..." required />
						</div>

						<div class="field-group">
							<label for="categoria">
								Categoría
								<span class="hint-inline">zapatillas / ropa / accesorios…</span>
							</label>
							<input id="categoria" bind:value={categoria} placeholder="zapatillas" />
						</div>
					</div>
				</div>

				<!-- COLUMNA DERECHA -->
				<div class="col">
					<div class="field-group">
						<label for="precio">Precio publicado (€)</label>
						<input
							id="precio"
							type="number"
							min="0"
							step="0.01"
							bind:value={precio_publicado}
							placeholder="180"
						/>
					</div>

					<div class="double-row">
						<div class="field-group">
							<label for="talla">Talla</label>
							<input id="talla" bind:value={talla} placeholder="42" />
						</div>

						<div class="field-group">
							<label for="stock">Stock</label>
							<input id="stock" type="number" min="0" bind:value={stock} />
						</div>
					</div>

					<div class="field-group">
						<label for="imagen-url">
							Imagen URL (opcional)
							<span class="hint-inline">Se usará como portada en el catálogo.</span>
						</label>
						<input id="imagen-url" bind:value={imagen_url} placeholder="https://..." />
					</div>
				</div>
			</div>

			{#if errorMsg}
				<p class="msg error">{errorMsg}</p>
			{/if}
			{#if successMsg}
				<p class="msg success">{successMsg}</p>
			{/if}

			<div class="actions">
				<button type="submit" class="btn-primary" disabled={loading || !!productId}>
					{#if productId}
						Producto creado
					{:else if loading}
						Guardando...
					{:else}
						Crear producto
					{/if}
				</button>
			</div>
		</form>

		<!-- TARJETA DE IMÁGENES -->
		<section class="card images-card">
			<h2>Imágenes</h2>

			{#if !productId}
				<p class="images-hint">Guarda primero el producto para habilitar la subida de imágenes.</p>
				<p class="images-tip">
					Tip: rellena todos los campos de la izquierda, pulsa
					<strong>“Crear producto”</strong> y esta tarjeta se activará automáticamente.
				</p>
			{:else}
				<p class="images-hint">
					Sube 1 o varias imágenes. La primera se usará como portada si
					<code>imagen_url</code> está vacío.
				</p>

				<ImageUploader
					bind:imageUrl={lastImageUrl}
					{productId}
					bucket="productos"
					folder={productId ? `admin/${productId}` : ''}
					on:uploaded={handleImageUploaded}
					ensureProduct={ensureProductCreated}
				/>

				{#if lastImageUrl}
					<p class="small">Última imagen subida:</p>
					<img class="preview" src={lastImageUrl} alt="Previsualización" />
				{/if}
			{/if}
		</section>
	</div>
</section>

<style>
	.new-product {
		padding: 24px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.images-hint,
	.images-tip{
		color: #111;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;
	}

	.page-header h1 {
		margin: 0 0 4px;
		font-size: 26px;
	}

	.page-header p {
		margin: 0;
		font-size: 14px;
		opacity: 0.8;
	}

	.btn-secondary {
		border-radius: 999px;
		border: 1px solid #ddd;
		background: #f7f7f7;
		padding: 8px 16px;
		font-size: 14px;
		cursor: pointer;
	}

	.layout {
		display: flex;
		gap: 24px;
		align-items: flex-start;
	}

	.card {
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
	}

	.main-card {
		flex: 2;
		padding: 20px 22px 18px;
	}

	.images-card {
		flex: 1;
		padding: 18px 20px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 2fr 1.3fr;
		gap: 20px;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 14px;
	}

	.field-group label {
		font-weight: 600;
	}

	.hint-inline {
		margin-left: 6px;
		font-weight: 400;
		font-size: 12px;
		opacity: 0.7;
	}

	input,
	textarea {
		padding: 8px 10px;
		border-radius: 10px;
		border: 1px solid #ccc;
		font-size: 14px;
		font-family: inherit;
	}

	textarea {
		resize: vertical;
		min-height: 90px;
	}

	.double-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 14px;
	}

	.btn-primary {
		padding: 10px 18px;
		border-radius: 999px;
		border: none;
		background: #111;
		color: #fff;
		cursor: pointer;
		font-weight: 700;
		font-size: 14px;
	}

	.btn-primary[disabled] {
		opacity: 0.6;
		cursor: default;
	}

	.msg {
		font-size: 13px;
		margin-top: 8px;
	}

	.msg.error {
		color: #b00020;
	}

	.msg.success {
		color: #0a8a0a;
	}

	.images-card h2 {
		margin: 0 0 8px;
		font-size: 18px;
	}

	.images-hint {
		margin: 0 0 6px;
		font-size: 13px;
		opacity: 0.8;
	}

	.images-tip {
		margin: 0;
		font-size: 12px;
		opacity: 0.7;
	}

	.small {
		font-size: 13px;
		margin-top: 10px;
	}

	.preview {
		margin-top: 6px;
		max-width: 220px;
		border-radius: 10px;
		border: 1px solid #ddd;
		display: block;
	}

	@media (max-width: 960px) {
		.layout {
			flex-direction: column;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
