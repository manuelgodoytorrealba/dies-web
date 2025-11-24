<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  import FiltersBar from '$lib/components/filters/FiltersBar.svelte';
  import { filtersStore } from '$lib/stores/filters';
  import type { Product } from '$lib/types/product';
  

  let products: Product[] = data.products ?? [];
  let filtered: Product[] = products;

  $: filters = $filtersStore;
  $: filtered = applyClientFilters(products, filters);

  function applyClientFilters(list: Product[], f: any) {
    let out = [...list];

    // categoria (cuando exista la columna en DB)
    if (f.category) {
      out = out.filter(p =>
        ((p as any).categoria ?? 'zapatillas').toLowerCase() === f.category.toLowerCase()
      );
    }

    if (f.brand) {
      const b = f.brand.toLowerCase();
      out = out.filter(p => p.marca.toLowerCase().includes(b));
    }

    if (f.size) {
      out = out.filter(p => String(p.talla) === String(f.size));
    }

    if (f.query) {
      const q = f.query.toLowerCase();
      out = out.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }

    if (f.priceMin != null) {
      out = out.filter(p => Number(p.precio_publicado) >= f.priceMin);
    }
    if (f.priceMax != null) {
      out = out.filter(p => Number(p.precio_publicado) <= f.priceMax);
    }

    if (f.orderBy === 'price-asc') {
      out.sort((a, b) => Number(a.precio_publicado) - Number(b.precio_publicado));
    } else if (f.orderBy === 'price-desc') {
      out.sort((a, b) => Number(b.precio_publicado) - Number(a.precio_publicado));
    } else if (f.orderBy === 'newest') {
      out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return out;
  }
</script>

<section class="catalog">
 
  <h1>Catálogo</h1>

  <FiltersBar />

  {#if filtered.length === 0}
    <p>No hay productos con esos filtros.</p>
  {:else}
    <div class="grid">
      {#each filtered as p}
        <article class="card">
          <a href={`/product/${p.product_id}`}>
            <img src={p.imagen_url ?? ''} alt={p.nombre} />
            <h2>{p.nombre}</h2>
          </a>

          <p class="brand">{p.marca}</p>
          <p class="price">€{p.precio_publicado}</p>
          <p class="size">Talla {p.talla}</p>

        </article>
      {/each}
    </div>
  {/if}
  
</section>

<style>
  .catalog { padding: 24px; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
  .card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    background: white;
  }
  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    border-radius: 8px;
    background: #fafafa;
  }
  h2 { font-size: 16px; margin: 8px 0 4px; }
  .brand { opacity: 0.7; font-size: 14px; }
  .price { font-weight: 600; margin-top: 4px; }
  .size { font-size: 13px; opacity: 0.8; }
</style>