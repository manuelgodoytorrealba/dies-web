<script lang="ts">
	import type { PageData } from './$types';
	import WhatsAppButton from '../../catalog/WhatsAppButton.svelte';

	export let data: PageData;

	const p = data.product;

	type Variant = {
		product_id: string;
		talla: string | number;
		stock: number;
		precio_publicado: string | number;
	};

	type ProductImage = {
		id: string;
		url: string;
		orden?: number | null;
	};

	const images: ProductImage[] = data.images ?? [];
	const variants: Variant[] = data.variants ?? [];

	// ---------------- GALERÍA ----------------
	const gallery: ProductImage[] = images.length
		? [...images].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
		: p.imagen_url
			? [{ id: 'main', url: p.imagen_url }]
			: [];

	let currentIndex = 0;

	function prev() {
		if (!gallery.length) return;
		currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
	}

	function next() {
		if (!gallery.length) return;
		currentIndex = (currentIndex + 1) % gallery.length;
	}

	function goTo(i: number) {
		currentIndex = i;
	}

	// ------------- SELECCIÓN DE TALLA -------------

	let selectedVariant: Variant | null =
		variants.find((v) => v.product_id === p.product_id) ?? (variants.length ? variants[0] : null);

	$: selectedSize = selectedVariant?.talla ?? null;

	$: selectedSizeLabel =
		selectedVariant?.talla ?? p.talla ?? (variants.length ? variants[0].talla : null);

	$: displayPrice = selectedVariant?.precio_publicado ?? p.precio_publicado;

	function handleSelectSize(v: Variant) {
		selectedVariant = v;
	}

	$: productForWhatsApp = selectedVariant
		? {
				...p,
				product_id: selectedVariant.product_id,
				talla: selectedVariant.talla,
				precio_publicado: selectedVariant.precio_publicado
			}
		: p;
</script>

<section class="product-detail-page">
	<div class="product-shell">
		<!-- FILA SUPERIOR: back + tallas -->
		<header class="product-header">
			<button class="back-link" type="button" on:click={() => history.back()}>
				<svg
					class="back-icon"
					width="28"
					height="28"
					viewBox="0 0 24 24"
					stroke="black"
					fill="none"
					stroke-width="2.4"
				>
					<path d="M15 6 L9 12 L15 18" stroke-linecap="round" stroke-linejoin="round" />
				</svg>

				<span class="back-text">Volver al catálogo</span>
			</button>

			{#if variants && variants.length}
				<div class="sizes-wrapper">
					<!-- <p class="sizes-label">Tallas disponibles</p> -->

					<div class="sizes-row">
						{#each variants as v}
							<button
								type="button"
								class="size-chip"
								class:selected={v.talla === selectedSize}
								on:click={() => handleSelectSize(v)}
							>
								{v.talla}
							</button>
						{/each}
					</div>

					<!-- {#if selectedSizeLabel}
						<p class="sizes-selected">
							Seleccionada: {selectedSizeLabel}
						</p>
					{/if} -->
				</div>
			{/if}

			<!-- columna derecha vacía para balancear -->
			<div class="product-header__right-placeholder"></div>
		</header>

		<!-- ZONA CENTRAL: IMAGEN + FLECHAS -->
		<main class="product-main">
			<div class="gallery">
				<div class="main-image">
					{#if gallery.length}
						<img src={gallery[currentIndex].url} alt={p.nombre} />
					{:else}
						<div class="main-image empty">
							<span>Sin imágenes</span>
						</div>
					{/if}
				</div>

				{#if gallery.length > 1}
					<div class="thumbs">
						{#each gallery as img, i}
							<button type="button" class:active={i === currentIndex} on:click={() => goTo(i)}>
								<img src={img.url} alt={`${p.nombre} ${i + 1}`} />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</main>

		<!-- FILA INFERIOR: info + CTA -->
		<section class="product-bottom">
			<div class="product-info">
				<p class="product-info__brand">{p.marca}</p>
				<h1 class="product-info__name">{p.nombre}</h1>

				{#if selectedSizeLabel}
					<p class="product-info__size">
						Talla seleccionada: <strong>{selectedSizeLabel}</strong>
					</p>
				{/if}
			</div>

			<div class="cta-row">
				<!-- aquí ya metes tu componente con el logo de WhatsApp dentro -->
				<WhatsAppButton product={productForWhatsApp} />
			</div>
		</section>
	</div>
</section>

<style>
	/* Vista: panel blanco centrado, ocupa casi todo el viewport */
	.product-detail-page {
		min-height: calc(90vh - 120px); /* header + footer aprox */
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-bg);
		padding: 16px 0;
	}

	.product-shell {
		background: #fff;
		border-radius: 24px;
		max-width: 1100px;
		width: 100%;
		margin-inline: 16px;

		/* 👇 CLAVE: limitamos altura total en desktop */
		max-height: 620px;

		padding: 20px 32px 24px;
		display: grid;
		grid-template-rows: auto 1fr auto;
		row-gap: 20px;
		box-shadow: var(--shadow-soft);
		overflow: hidden; /* por si acaso algo se quiere salir */
	}

	/* -------- FILA SUPERIOR -------- */
	.product-header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		column-gap: 24px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 500;
		padding: 8px 0;
		color: #000;
		transition: opacity 0.15s ease;
	}

	.back-link:hover {
		opacity: 0.6;
	}

	.back-icon {
		display: block;
	}

	.back-text {
		letter-spacing: 0.015em;
		font-family: var(--font-sans);
	}

	.product-header__right-placeholder {
		width: 32px;
		justify-self: end;
	}

	/* -------- TALLAS CENTRADAS -------- */
	.sizes-wrapper {
		text-align: center;
		justify-self: center; /* centrado dentro de la cabecera */
	}

	.sizes-row {
		display: inline-flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
		margin-right: 100px;
		
	}

	.size-chip {
		min-width: 72px;
		padding: 8px 18px;
		border-radius: 999px;
		border: none;
		background-color: #4a4643;
		color: #fff;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: 0.18s ease;
    font-family: var(--font-sans);
	}

	.size-chip.selected {
		background: #000;
		transform: translateY(-2px);
	}

	/* -------- ZONA CENTRAL: GALERÍA -------- */
	.product-main {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gallery {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 720px;
		margin-inline: auto;
		align-items: center;
	}

	.main-image {
		position: relative;
		border-radius: 16px;
		background: #fafafa;
		padding: 14px;
		display: flex;
		justify-content: center;
		align-items: center;

		/* 👇 algo más baja que antes para que todo quepa */
		max-height: 330px;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		width: 100%;
	}

	.main-image img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		display: block;
	}

	.main-image.empty {
		color: #999;
		font-size: 0.9rem;
	}

	.thumbs {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.thumbs button {
		border: 1px solid transparent;
		padding: 0;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		flex: 0 0 72px;
		height: 72px;
		background: #f5f5f5;
	}

	.thumbs button img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.thumbs button.active {
		border-color: #111;
	}

	/* -------- FILA INFERIOR -------- */
	.product-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.product-info {
		text-align: left;
	}

	.product-info__brand {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.product-info__name {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 4px;
	}

	.product-info__size {
		margin-top: 4px;
		font-size: 0.9rem;
	}

	.cta-row {
		flex-shrink: 0;
	}

	.cta-row :global(.btn-whatsapp),
	.cta-row :global(a.btn-whatsapp) {
		min-width: 260px;
	}

	/* 📱 Mobile / tablet */
	@media (max-width: 900px) {
		.product-detail-page {
			align-items: stretch;
			padding: 0;
		}

		.product-shell {
			border-radius: 0;
			max-width: 100%;
			max-height: none; /* en móvil dejamos que haga scroll */
			margin-inline: 0;
			padding: 16px 16px 32px;
			box-shadow: none;
			grid-template-rows: auto auto auto;
			row-gap: 16px;
		}

		.product-header {
			grid-template-columns: 1fr;
			row-gap: 12px;
			justify-items: flex-start;
		}

		.sizes-wrapper {
			justify-self: center;
			text-align: center;
		}

		.main-image {
			max-height: 320px;
		}

		.product-bottom {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.cta-row {
			width: 100%;
		}

		.cta-row :global(.btn-whatsapp),
		.cta-row :global(a.btn-whatsapp) {
			width: 100%;
			max-width: 320px;
		}
		.sizes-row {
			margin-right: 0px;
		}
	}

	/* 💻 Ajuste extra para tamaños grandes si quieres recolocar tallas */
	@media (min-width: 1200px) {
		.product-shell {
			max-height: 640px;
		}
	}
</style>
