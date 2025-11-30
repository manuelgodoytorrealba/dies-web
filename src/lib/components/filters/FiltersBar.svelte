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
	<div class="filters-categories-panel">
		<div class="filters-categories-panel__inner">
			{#each meta.categories as c}
				<button
					type="button"
					class="btn filters-category"
					class:selected={filters.category === c}
					on:click={() => setCategory(c)}
				>
					{c}
				</button>
			{/each}
		</div>
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
	.filters-categories-panel {
		margin: var(--space-3) auto;
		padding: var(--space-5) var(--space-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		

		/* que sea más estrecho */
		max-width: 550px;

		/* opcional: un pelín de sombra suave para destacar */
		box-shadow: var(--shadow-soft);
		background-color: var(--color-surface-elevated);
	}

	.filters-categories-panel__inner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	/* Botones de categoría (heredan de .btn) */
	.filters-category {
		text-transform: capitalize;
		min-width: 7rem;
		justify-content: center;
	}

	/* Estado seleccionado: usa el color principal y mantiene el “look botón” */
	.filters-category.selected {
		background-color: var(--color-primary);
		color: var(--color-text-muted);
	}

	/* Opcional: que al hacer click siga viéndose “activo” pero sin perder el color seleccionado */
	.filters-category.selected:active {
		transform: translateY(1px);
		background-color: var(--color-primary);
	}
	/* Contenedor de la barra de filtros */
.bar {
  max-width: 750px;
  width: 100%;
  margin-inline: auto;
  max-width: 750px;
  width: 100%;
  margin-inline: auto;
}

/* Layout interno de los campos */
.bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

/* Campos base: input + select */
.bar input,
.bar select {
  min-width: 150px;
  padding: var(--space-2) var(--space-3);

  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);

  background-color: var(--color-surface);
  color: var(--color-text);

  font-size: var(--text-sm);
  font-family: var(--font-sans);

  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

/* Placeholder suave */
.bar input::placeholder {
  color: var(--color-text);
}

/* Hover: un pelín de énfasis */
.bar input:hover,
.bar select:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

/* Focus: estado claro pero minimal */
.bar input:focus,
.bar select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-medium);
}

/* En móviles que respiren un poco */
@media (max-width: 768px) {
  .bar {
    gap: var(--space-2);
  }

  .bar input,
  .bar select {
    flex: 1 1 100%;
  }
}

	.active {
		border: 1px solid #444;
		padding: 12px;
		width: 220px;
		border-radius: 12px;
		margin-top: 10px;
		background-color: var(--color-surface-elevated);
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
