<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  type ProductImage = {
    id: string;
    url: string;
    orden?: number | null;
  };

  const p = data.product;

  // 👇 Hack suave para decirle a TS que aquí también hay `images`
  const images =
    (data as PageData & { images?: ProductImage[] }).images ?? [];

  const gallery: ProductImage[] =
    images.length
      ? [...images].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      : (p.imagen_url
          ? [{ id: 'main', url: p.imagen_url }]
          : []);

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
</script>

<section class="product-page">
  <div class="product-layout">
    <div class="gallery">
      {#if gallery.length}
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

          <img src={gallery[currentIndex].url} alt={p.nombre} />

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
      {:else}
        <div class="main-image empty">
          <span>Sin imágenes</span>
        </div>
      {/if}
    </div>

    <div class="info">
      <h1>{p.nombre}</h1>
      <p class="brand">{p.marca}</p>
      <p class="price">€{p.precio_publicado}</p>
      {#if p.talla}<p class="size">Talla {p.talla}</p>{/if}
      {#if p.descripcion}
        <p class="description">{p.descripcion}</p>
      {/if}
      <!-- aquí iría botón de WhatsApp, añadir a wishlist, etc -->
    </div>
  </div>
</section>

<style>
  .product-page {
    padding: 24px;
  }

  .product-layout {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 32px;
  }

  @media (max-width: 768px) {
    .product-layout {
      grid-template-columns: 1fr;
    }
  }

  .gallery {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    background: rgba(255, 255, 255, 0.8);
    width: 32px;
    height: 32px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
  }

  .nav.prev {
    left: 8px;
  }

  .nav.next {
    right: 8px;
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

  .info h1 {
    margin: 0 0 8px;
    font-size: 24px;
  }

  .brand {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 4px;
  }

  .price {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .size {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .description {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.5;
  }
</style>