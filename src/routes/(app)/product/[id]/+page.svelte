<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  import WhatsAppButton from '../../catalog/WhatsAppButton.svelte';

  const { product } = data;
</script>

<section class="product-detail">
  <img class="image" src={product.imagen_url ?? ''} alt={product.nombre} />

  <div class="info">
    <h1>{product.nombre}</h1>
    <p class="brand">{product.marca}</p>
    <p class="price">€{product.precio_publicado}</p>

    <p class="size">Talla: {product.talla}</p>

    <h2>Descripción</h2>
    <p>{product.descripcion}</p>

    <h2>Estado</h2>
    <p>{product.status_producto}</p>
    <WhatsAppButton product={p} />
  </div>
</section>

<style>
  .product-detail {
    display: flex;
    gap: 24px;
    padding: 24px;
  }

  .image {
    width: 340px;
    height: 340px;
    object-fit: contain;
    border-radius: 16px;
    background: #fafafa;
  }

  .info {
    max-width: 500px;
  }

  .brand {
    opacity: 0.7;
  }

  .price {
    font-size: 24px;
    font-weight: bold;
    margin: 16px 0;
  }

  .size {
    margin-bottom: 24px;
  }

  h2 {
    margin-top: 24px;
    margin-bottom: 8px;
  }
</style>