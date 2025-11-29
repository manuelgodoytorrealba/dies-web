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
  const gallery: ProductImage[] =
    images.length
      ? [...images].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      : (p.imagen_url ? [{ id: 'main', url: p.imagen_url }] : []);

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

  // Variante por defecto:
  // 1) la que coincide con el product_id actual
  // 2) si no, la primera
  // 3) si no hay, null
  let selectedVariant: Variant | null =
    variants.find((v) => v.product_id === p.product_id) ??
    (variants.length ? variants[0] : null);

  // talla seleccionada (solo el valor, para mostrar en chips)
  $: selectedSize = selectedVariant?.talla ?? null;

  // etiqueta para el texto "Talla seleccionada"
  $: selectedSizeLabel =
    selectedVariant?.talla ??
    p.talla ??
    (variants.length ? variants[0].talla : null);

  // precio a mostrar (si cambia por talla)
  $: displayPrice = selectedVariant?.precio_publicado ?? p.precio_publicado;

  function handleSelectSize(v: Variant) {
    selectedVariant = v;
  }

  // Objeto que se manda a WhatsApp
  $: productForWhatsApp =
    selectedVariant
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
    <!-- HEADER -->
    <header class="product-header">
      <a href="/catalog" class="back-link">
        <span class="back-link__icon" aria-hidden="true"></span>
        <span class="back-link__text">
          Volver a<br />catálogo
        </span>
      </a>

      <div class="product-header__right-placeholder"></div>
    </header>

    <!-- TALLAS (VARIANTS) -->
    {#if variants && variants.length}
      <section class="sizes-wrapper">
        <div class="sizes-header">
          <p class="sizes-label">Tallas disponibles</p>
          {#if selectedSizeLabel}
            <p class="sizes-selected">
              Seleccionada: {selectedSizeLabel}
            </p>
          {/if}
        </div>

        <div class="sizes-scroll">
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
        </div>

        {#if variants.length > 5}
          <p class="sizes-hint">
            Desliza lateralmente para ver todas las tallas →
          </p>
        {/if}
      </section>
    {/if}

    <!-- GALERÍA -->
    <main class="product-main">
      <div class="gallery">
        <div class="main-image">
          {#if gallery.length > 1}
            <button
              type="button"
              class="nav prev"
              on:click={prev}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
          {/if}

          {#if gallery.length}
            <img src={gallery[currentIndex].url} alt={p.nombre} />
          {:else}
            <div class="main-image empty">
              <span>Sin imágenes</span>
            </div>
          {/if}

          {#if gallery.length > 1}
            <button
              type="button"
              class="nav next"
              on:click={next}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          {/if}
        </div>

        {#if gallery.length > 1}
          <div class="thumbs">
            {#each gallery as img, i}
              <button
                type="button"
                class:active={i === currentIndex}
                on:click={() => goTo(i)}
              >
                <img src={img.url} alt={`${p.nombre} ${i + 1}`} />
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </main>

    <!-- INFO -->
    <section class="product-info">
      <p class="product-info__brand">{p.marca}</p>
      <h1 class="product-info__name">{p.nombre}</h1>
      <p class="product-info__price">€{displayPrice}</p>

      {#if selectedSizeLabel}
        <p class="product-info__size">
          Talla seleccionada: <strong>{selectedSizeLabel}</strong>
        </p>
      {/if}

      {#if p.descripcion}
        <p class="product-info__description">{p.descripcion}</p>
      {/if}
    </section>

    <!-- CTA WHATSAPP -->
    <div class="cta-row">
      <WhatsAppButton product={productForWhatsApp} />
    </div>
  </div>
</section>

<style>
  /* PANTALLA COMPLETA ENTRE HEADER Y FOOTER */
  .product-detail-page {
    min-height: calc(100vh - 120px); /* ajusta si hace falta */
    padding: 0;
    display: flex;
    justify-content: center;
    background: transparent;
  }

  .product-shell {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-5) var(--space-4) var(--space-6);
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
  }

  /* HEADER */
  .product-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    margin-bottom: var(--space-5);
    column-gap: var(--space-3);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    color: var(--color-text);
    font-size: var(--text-xs);
  }

  .back-link__icon {
    width: 32px;
    height: 32px;
    border-left: 2px solid #000;
    border-top: 2px solid #000;
    transform: rotate(-45deg);
    margin-right: 6px;
  }

  .back-link__text {
    line-height: 1.2;
    color: #000;
  }

  .product-header__right-placeholder {
    justify-self: end;
    width: 40px;
  }

  /* TALLAS */
  .sizes-wrapper {
  margin-bottom: var(--space-6);
}

.sizes-scroll {
  overflow-x: auto;
  padding: var(--space-2) 0;
}

.sizes-row {
  display: flex;
  justify-content: center; /* ⭐ CENTRAR SIEMPRE */
  gap: var(--space-3);
  padding: 0 var(--space-2);
  min-width: 100%;
}

.size-chip {
  min-width: 64px;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background-color: #4a4643;
  color: white;
  text-align: center;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.18s ease;
}

.size-chip.selected {
  background: black;
  border-color: black;
  color: white;
  transform: translateY(-2px);
}

  .sizes-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }

  .sizes-row {
    display: inline-flex;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-1);
  }

  .size-chip {
    flex: 0 0 auto;
    min-width: 56px;
    padding: var(--space-2) var(--space-3);
    border-radius: 999px;
    border: none;
    background-color: var(--color-primary-soft, #555);
    color: #fff;
    text-align: center;
    font-size: var(--text-sm);
    font-weight: 500;
    box-shadow: var(--shadow-soft);
    cursor: pointer;
    transition:
      background-color 120ms ease,
      transform 80ms ease,
      box-shadow 120ms ease;
  }

  .size-chip.selected {
    background-color: #000;
    transform: translateY(-1px);
    box-shadow: var(--shadow-strong);
  }

  .size-chip:active {
    transform: translateY(0);
  }

  .sizes-hint {
    margin-top: var(--space-1);
    font-size: var(--text-xxs);
    color: var(--color-text-muted, #888);
    text-align: center;
  }

  /* GALERÍA */
  .product-main {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-5);
  }

  .gallery {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
    max-width: 720px;
  }

  .main-image {
    position: relative;
    border-radius: 16px;
    border: 1px solid #eee;
    overflow: hidden;
    background: #fafafa;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-image img {
    width: 100%;
    max-height: 520px;
    object-fit: contain;
    margin:0 auto;
    display: block;
  }

  .main-image.empty {
    color: #999;
    font-size: 14px;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(255, 255, 255, 0.85);
    width: 40px;
    height: 40px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 24px;
    font-weight: 600;
  }

  .nav.prev {
    left: 12px;
  }

  .nav.next {
    right: 12px;
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
    object-fit: cover;
    display: block;
  }

  .thumbs button.active {
    border-color: #111;
  }

  /* INFO */
  .product-info {
    text-align: center;
    margin-bottom: var(--space-6);
  }

  .product-info__brand {
    font-size: var(--text-xs);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text);
    margin-bottom: var(--space-1);
  }

  .product-info__name {
    font-size: var(--text-lg);
    margin-bottom: var(--space-1);
    color: #000;
  }

  .product-info__price {
    font-size: var(--text-md);
    font-weight: 600;
  }

  .product-info__size {
    margin-top: var(--space-1);
    font-size: var(--text-sm);
  }

  .product-info__description {
    margin-top: var(--space-2);
    font-size: var(--text-sm);
    line-height: 1.5;
    color: var(--color-text);
  }

  /* CTA WHATSAPP */
  .cta-row {
    display: flex;
    justify-content: center;
  }

  .cta-row :global(.btn-whatsapp),
  .cta-row :global(a.btn-whatsapp) {
    min-width: 260px;
  }

  /* Fondo blanco ocupando toda la pantalla */
.product-detail-page {
  background: white;
  padding: 0;
  margin: 0;
}

/* El contenedor interno ahora debe ser blanco a full */
.product-shell {
  background: white;
  max-width: 100%;
  width: 100%;
  border-radius: 0;
  padding: 32px 20px 80px;
  box-shadow: none;
}

  @media (max-width: 768px) {
    .product-detail-page {
      min-height: calc(100vh - 100px);
      padding: 0;
    }

    .product-shell {
      padding: var(--space-4) var(--space-3) var(--space-6);
      border-radius: 0;
    }

    .product-header {
      margin-bottom: var(--space-4);
    }

    .gallery {
      max-width: 100%;
    }

    .cta-row :global(.btn-whatsapp),
    .cta-row :global(a.btn-whatsapp) {
      width: 100%;
      max-width: 320px;
    }
  }
</style>