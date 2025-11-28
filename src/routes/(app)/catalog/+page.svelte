<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/catalog/ProductCard.svelte';
  import FiltersBar from '$lib/components/filters/FiltersBar.svelte';
  import { filtersStore } from '$lib/stores/filters';
  import type { Product } from '$lib/types/product';

  export let data: PageData;

  // Todos los productos que vienen del servidor (sea desde +page.ts o +page.server.ts)
  let products: Product[] = Array.isArray(data.products) ? data.products : [];

  // Tamaño de "página" en el frontend
  const PAGE_SIZE = 8;

  // Cuántos productos mostramos actualmente
  let visibleCount = PAGE_SIZE;

  // Arrays derivados
  let filtered: Product[] = [];
  let visible: Product[] = [];

  // Filtros del store (igual que antes)
  $: filters = $filtersStore;

  // Cada vez que cambien productos o filtros,
  // recalculamos filtrados y reiniciamos visibleCount.
  $: {
    filtered = applyClientFilters(products, filters);
    visibleCount = PAGE_SIZE;
  }

  // Los productos que realmente se pintan
  $: visible = filtered.slice(0, visibleCount);

  // ¿Quedan más por mostrar?
  $: hasMore = visibleCount < filtered.length;

  let sentinel: HTMLDivElement | null = null;
  let loading = false;

function loadMore() {
  if (loading) return;
  if (!hasMore) return;

  loading = true;
  console.log('➡️ loadMore: visibles antes =', visibleCount);

  visibleCount += PAGE_SIZE;

  console.log('⬆️ loadMore: visibles después =', visibleCount);
  loading = false;
}

  onMount(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  });

  // --- mismo filtrado de antes, pero blindado ---
  function applyClientFilters(list: Product[] | null | undefined, f: any) {
    const source = Array.isArray(list) ? list : [];
    let out = [...source];

    if (f?.category) {
      out = out.filter((p) =>
        ((p as any).categoria ?? 'zapatillas').toLowerCase() === f.category.toLowerCase()
      );
    }

    if (f?.brand) {
      const b = String(f.brand).toLowerCase();
      out = out.filter((p) => p.marca.toLowerCase().includes(b));
    }

    if (f?.size) {
      out = out.filter((p) => String(p.talla) === String(f.size));
    }

    if (f?.query) {
      const q = String(f.query).toLowerCase();
      out = out.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion ?? '').toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    if (f?.priceMin != null) {
      out = out.filter((p) => Number(p.precio_publicado) >= f.priceMin);
    }
    if (f?.priceMax != null) {
      out = out.filter((p) => Number(p.precio_publicado) <= f.priceMax);
    }

    if (f?.orderBy === 'price-asc') {
      out.sort((a, b) => Number(a.precio_publicado) - Number(b.precio_publicado));
    } else if (f?.orderBy === 'price-desc') {
      out.sort((a, b) => Number(b.precio_publicado) - Number(a.precio_publicado));
    } else if (f?.orderBy === 'newest') {
      out.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return out;
  }
</script>

<section class="catalog">
  <FiltersBar />
 

  {#if visible.length === 0}
    <p>No hay productos con esos filtros.</p>
  {:else}

    <div class="grid">
  {#each visible as p}
    <ProductCard product={p} />
  {/each}
</div>

    {#if hasMore}
      <div bind:this={sentinel} class="sentinel">
        {#if loading}
          <p>Cargando más productos…</p>
        {/if}
      </div>
    {/if}
  {/if}
</section>

<style>
  .catalog {
    padding: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .sentinel {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
</style>