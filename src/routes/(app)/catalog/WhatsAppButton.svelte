<script lang="ts">
  import type { Product } from '$lib/types/product';

  export let product: Product;

  const PHONE = '34680973028'; // sin +, formato wa.me

  // Mensaje base (lo puedes ajustar luego)
  $: message =
    
    `Hola! Me interesa este producto:\n` +
    `• ${product.nombre}\n` +
    `• Marca: ${product.marca}\n` +
    `• Talla: ${product.talla}\n` +
    `• Precio: €${product.precio_publicado}\n\n` +
    `¿Sigue disponible?`;

  // URL del producto (para tracking humano)
  $: productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.product_id}`
      : '';

  $: whatsappUrl =
    `https://wa.me/${PHONE}?text=${encodeURIComponent(message + `\n\nLink: ${productUrl}`)}`;

  async function handleClick() {
    try {
      // tracking lead (no bloquea si falla)
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // keepalive ayuda si el navegador navega rápido
        keepalive: true,
        body: JSON.stringify({
          source: 'whatsapp',
          event: 'click',
          product_id: product.product_id,
          slug: product.slug,
          marca: product.marca,
          talla: product.talla,
          precio_publicado: product.precio_publicado
        })
      });
    } catch (e) {
      console.warn('[whatsapp lead tracking]', e);
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
</script>

<button class="wa" on:click={handleClick}>
  Preguntar por WhatsApp
</button>

<style>
  .wa {
    width: 100%;
    padding: 14px 18px;
    border-radius: 999px;
    border: none;
    background: #111;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.05s ease;
  }
  .wa:active { transform: translateY(1px); }
</style>