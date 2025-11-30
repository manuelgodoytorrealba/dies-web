<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/catalog/ProductCard.svelte';
  import FiltersBar from '$lib/components/filters/FiltersBar.svelte';
  import { filtersStore } from '$lib/stores/filters';
  import type { CatalogModel } from '$lib/gateways/products';

  export let data: PageData;

  // Ahora trabajamos con "models" que vienen del servidor
  let models: CatalogModel[] = Array.isArray(data.models) ? data.models : [];

  const PAGE_SIZE = 24;
  let visibleCount = PAGE_SIZE;

  let filtered: CatalogModel[] = [];
  let visible: CatalogModel[] = [];

  // Filtros del store (igual que antes)
  $: filters = $filtersStore;

  // Recalcular cuando cambien datos o filtros
  $: {
    filtered = applyClientFilters(models, filters);
    visibleCount = PAGE_SIZE;
  }

  // Los que realmente se pintan
  $: visible = filtered.slice(0, visibleCount);

  // ¿Hay más?
  $: hasMore = visibleCount < filtered.length;

  let sentinel: HTMLDivElement | null = null;
  let loading = false;

  function loadMore() {
    if (loading) return;
    if (!hasMore) return;

    loading = true;
    visibleCount += PAGE_SIZE;
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

  // --- Filtrado en cliente adaptado a CatalogModel ---
  function applyClientFilters(list: CatalogModel[] | null | undefined, f: any) {
    const source = Array.isArray(list) ? list : [];
    let out = [...source];

    // categoría
    if (f?.category) {
      out = out.filter((m) =>
        (m.categoria ?? 'zapatillas').toLowerCase() === f.category.toLowerCase()
      );
    }

    // marca
    if (f?.brand) {
      const b = String(f.brand).toLowerCase();
      out = out.filter((m) => m.marca.toLowerCase().includes(b));
    }

    // talla -> usamos tallas_disponibles (array)
    if (f?.size) {
      const s = String(f.size);
      out = out.filter((m) => m.tallas_disponibles.includes(s));
    }

    // búsqueda texto -> nombre + marca
    if (f?.query) {
      const q = String(f.query).toLowerCase();
      out = out.filter(
        (m) =>
          m.nombre.toLowerCase().includes(q) ||
          m.marca.toLowerCase().includes(q)
      );
    }

    // precio mínimo / máximo (precio_desde)
    if (f?.priceMin != null) {
      out = out.filter((m) => Number(m.precio_desde) >= f.priceMin);
    }
    if (f?.priceMax != null) {
      out = out.filter((m) => Number(m.precio_desde) <= f.priceMax);
    }

    // ordenación
    if (f?.orderBy === 'price-asc') {
      out.sort((a, b) => Number(a.precio_desde) - Number(b.precio_desde));
    } else if (f?.orderBy === 'price-desc') {
      out.sort((a, b) => Number(b.precio_desde) - Number(a.precio_desde));
    }
    // si f?.orderBy === 'newest' no hacemos nada por ahora (la vista no tiene created_at)

    return out;
  }
</script>

<section class="catalog">
  <FiltersBar />

  {#if visible.length === 0}
    <p>No hay productos con esos filtros.</p>
  {:else}
    <div class="grid">
      {#each visible as model}
        <ProductCard {model} />
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
    width: 100%;
    max-width: 1200px;      /* anchura “DS” */
    margin: 24px auto 40px; /* centrado bajo el header */
    padding: 0 16px;
  }

  .grid {
    display: grid;
    gap: 24px;
    margin-top: 16px;
    grid-template-columns: 1fr; /* base: móvil = 1 card */
  }

  /* >= 780px → 2 columnas */
  @media (min-width: 780px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  /* >= 1180px aprox → 3 columnas */
  @media (min-width: 1180px) {
    .grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .sentinel {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
</style>