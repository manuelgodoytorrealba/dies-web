<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  import { fetchProductsMeta } from '$lib/gateways/meta';
  import { metaStore } from '$lib/stores/meta';

  import {
    filtersStore,
    setQuery,
    setCategory,
    setBrand,
    setSize,
    setOrderBy,
    resetFilters
  } from '$lib/stores/filters';

  $: meta = $metaStore;
  $: filters = $filtersStore;

  const orderOptions = [
    { value: 'none', label: 'Ordenar por' },
    { value: 'newest', label: 'Novedades' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' }
  ];

  async function refreshMeta(category?: string) {
    // evita SSR
    if (!browser) return;

    const m = await fetchProductsMeta(fetch, category);
    metaStore.set(m);
  }

  // primera carga en cliente
  onMount(async () => {
    await refreshMeta(filters.category);
  });

  // cada vez que cambie categoría en cliente, refresca meta
  $: if (browser && filters.category) {
    refreshMeta(filters.category);
  }
</script>

<!-- Chips de categoría -->
{#if meta?.categories?.length}
  <div class="categories">
    {#each meta.categories as c}
      <button
        class:selected={filters.category === c}
        on:click={() => setCategory(c)}
      >
        {c}
      </button>
    {/each}
  </div>
{/if}

<!-- Barra principal -->
<div class="bar">
  <input
    placeholder="Buscar..."
    bind:value={filters.query}
    on:input={(e) => setQuery((e.target as HTMLInputElement).value)}
  />

  <select
    bind:value={filters.orderBy}
    on:change={(e) => setOrderBy((e.target as HTMLSelectElement).value as any)}
  >
    {#each orderOptions as opt}
      <option value={opt.value}>
        {opt.label}
      </option>
    {/each}
  </select>

  <select
    bind:value={filters.brand}
    on:change={(e) => setBrand((e.target as HTMLSelectElement).value)}
  >
    <option value="">Marca</option>
    {#each meta.brands as b}
      <option value={b}>{b}</option>
    {/each}
  </select>

  <select
    bind:value={filters.size}
    on:change={(e) => setSize((e.target as HTMLSelectElement).value)}
  >
    <option value="">Talla</option>
    {#each meta.sizes as s}
      <option value={String(s)}>{s}</option>
    {/each}
  </select>
</div>

<!-- Pills activas -->
{#if filters.query || filters.brand || filters.size || filters.orderBy !== 'none'}
  <aside class="active">
    <p>Filtros activos</p>

    {#if filters.orderBy !== 'none'}
      <span class="pill">
        {orderOptions.find((o) => o.value === filters.orderBy)?.label}
        <button on:click={() => setOrderBy('none')}>✕</button>
      </span>
    {/if}

    {#if filters.brand}
      <span class="pill">
        {filters.brand}
        <button on:click={() => setBrand('')}>✕</button>
      </span>
    {/if}

    {#if filters.size}
      <span class="pill">
        {filters.size}
        <button on:click={() => setSize('')}>✕</button>
      </span>
    {/if}

    {#if filters.query}
      <span class="pill">
        "{filters.query}"
        <button on:click={() => setQuery('')}>✕</button>
      </span>
    {/if}

    <button class="reset" on:click={resetFilters}>Reset</button>
  </aside>
{/if}

<style>
  .categories {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 12px 0 18px;
  }
  .categories button {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid #444;
    background: #ddd;
    cursor: pointer;
    font-weight: 600;
    text-transform: capitalize;
  }
  .categories button.selected {
    background: #666;
    color: white;
  }

  .bar {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  input,
  select {
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid #444;
    min-width: 140px;
  }

  .active {
    border: 1px solid #444;
    padding: 12px;
    width: 220px;
    border-radius: 12px;
    margin-top: 10px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #666;
    color: white;
    padding: 6px 10px;
    border-radius: 999px;
    margin: 6px 6px 0 0;
    font-size: 12px;
  }
  .pill button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
  }
  .reset {
    display: block;
    margin-top: 10px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #444;
    background: white;
    cursor: pointer;
  }
</style>