<script lang="ts">
  import type { Product } from '$lib/types/product';

  export let product: Product;
</script>

<article class="product-card card">
  <a class="product-card__link" href={`/product/${product.product_id}`}>
    <!-- HEADER: texto arriba -->
    <header class="product-card__header">
      <div class="product-card__title-block">
        {#if product.marca}
          <p class="product-card__brand">
            {product.marca}
          </p>
        {/if}

        <h2 class="product-card__name">
          {product.nombre}
        </h2>

        {#if product.descripcion}
          <p class="product-card__description">
            {product.descripcion}
          </p>
        {/if}
      </div>

     
    </header>

    <!-- IMAGEN ABAJO -->
    <div class="product-card__image-wrapper">
      {#if product.imagen_url}
        <img
          src={product.imagen_url}
          alt={product.nombre}
          loading="lazy"
        />
      {:else}
        <div class="product-card__image-placeholder">
          <span>Sin imagen</span>
        </div>
      {/if}
    </div>
  </a>
</article>

<style>
  .product-card {
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-subtle);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-soft);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast),
      border-color var(--transition-fast);
  }

  .product-card__link {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  /* HEADER TEXTO ARRIBA */
  .product-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-1);
  }

  .product-card__title-block {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    max-width: 70%;
  }

  .product-card__brand {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted);
  }

  .product-card__name {
    font-size: var(--text-md);
    font-weight: var(--font-weight-semibold, 600);
    line-height: 1.3;
    color: black;
  }

  .product-card__description {
    margin-top: var(--space-1);
    font-size: var(--text-xxs);
    color: var(--color-text-muted);
    line-height: 1.5;
    max-height: 3rem; /* 2–3 líneas */
    overflow: hidden;
  }

  /* IMAGEN ABAJO */
  .product-card__image-wrapper {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: transparent;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-card__image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .product-card__image-placeholder {
    width: 100%;
    height: 100%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong);
    border-color: var(--color-border-strong);
  }
</style>