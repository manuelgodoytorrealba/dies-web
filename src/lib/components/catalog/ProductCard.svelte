<script lang="ts">
  import type { CatalogModel } from '$lib/gateways/products';

  export let model: CatalogModel;
</script>

<article class="product-card card">
  <!-- Usamos sample_product_id para ir a la página de detalle -->
  <a class="product-card__link" href={`/product/${model.sample_product_id}`}>
    <!-- HEADER: texto arriba -->
    <header class="product-card__header">
      <div class="product-card__title-block">
        {#if model.marca}
          <p class="product-card__brand">
            {model.marca}
          </p>
        {/if}

        <h2 class="product-card__name">
          {model.nombre}
        </h2>

        <!-- Info básica de modelo -->
        <p class="product-card__meta">
          Tallas: {model.tallas_disponibles.join(' · ')} · Stock total: {model.stock_total}
        </p>

        <p class="product-card__price">
          Desde €{model.precio_desde}
        </p>
      </div>
    </header>

    <!-- IMAGEN ABAJO -->
    <div class="product-card__image-wrapper">
      {#if model.imagen_url}
        <img
          src={model.imagen_url}
          alt={model.nombre}
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
    max-width: 100%;
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

  .product-card__meta {
    margin-top: var(--space-1);
    font-size: var(--text-xxs);
    color: var(--color-text-muted);
  }

  .product-card__price {
    margin-top: var(--space-1);
    font-size: var(--text-sm);
    font-weight: 600;
  }

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