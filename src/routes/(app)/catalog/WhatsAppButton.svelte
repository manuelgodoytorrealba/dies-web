<script lang="ts">
  import type { Product } from '$lib/types/product';

  export let product: Product;

  const PHONE = '34680973028'; // sin +

  // Mensaje base
  $: message =
    `Hola! Me interesa este producto:\n` +
    `• ${product.nombre}\n` +
    `• Marca: ${product.marca}\n` +
    `• Talla: ${product.talla}\n` +
    `• Precio: €${product.precio_publicado}\n\n` +
    `¿Sigue disponible?`;

  // URL del producto
  $: productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.product_id}`
      : '';

  // WhatsApp URL oficial
  $: whatsappUrl =
    `https://wa.me/${PHONE}?text=${encodeURIComponent(
      message + `\n\nLink: ${productUrl}`
    )}`;

  // tracking antes de abrir WhatsApp
  async function handleClick(event: MouseEvent) {
    event.preventDefault();

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          source: 'whatsapp',
          event: 'click',
          product_id: product.product_id,
          slug: product.slug,
          marca: product.marca,
          talla: product.talla,
          precio_publicado: product.precio_publicado,
          source_page: location.pathname  
        })
      });
    } catch (e) {
      console.warn('[whatsapp lead tracking]', e);
    }

    // NO usar window.open → Safari lo bloquea
    // Esto funciona en TODOS los navegadores:
    window.location.href = whatsappUrl;
  }
</script>

<a class="wa" href={whatsappUrl} on:click={handleClick}>
  Preguntar por WhatsApp
</a>

<style>
  .wa {
    display: block;
    width: 100%;
    padding: 14px 18px;
    border-radius: 999px;
    border: none;
    background: #111;
    color: white;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: transform 0.05s ease;
  }

  .wa:active { 
    transform: translateY(1px); 
  }
</style>