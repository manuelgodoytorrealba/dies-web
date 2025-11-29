<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	type StockRow = {
		product_id: string;
		modelo_slug: string | null;
		nombre: string;
		marca: string;
		talla: string | number | null;
		stock: number;
		status_producto: string | null;
		published: boolean;
	};

	const rawItems: any[] = data.items ?? [];

	// Normalizamos para asegurarnos de que stock sea número
	let rows: StockRow[] = rawItems.map((r) => ({
		product_id: r.product_id,
		modelo_slug: r.modelo_slug,
		nombre: r.nombre,
		marca: r.marca,
		talla: r.talla,
		stock: Number(r.stock ?? 0),
		status_producto: r.status_producto ?? 'disponible',
		published: !!r.published
	}));

	// Filtros básicos
	let query = '';
	let stateFilter = 'all';
	let brandFilter = 'all';

	$: filteredRows = rows
		.filter((r) => {
			if (!query) return true;
			const q = query.toLowerCase();
			return (
				(r.modelo_slug ?? '').toLowerCase().includes(q) ||
				r.nombre.toLowerCase().includes(q) ||
				r.marca.toLowerCase().includes(q) ||
				String(r.talla ?? '').includes(q)
			);
		})
		.filter((r) => (stateFilter === 'all' ? true : (r.status_producto ?? '') === stateFilter))
		.filter((r) =>
			brandFilter === 'all' ? true : r.marca.toLowerCase() === brandFilter.toLowerCase()
		);

	// Métricas rápidas
	$: totalPairs = rows.length;
	$: totalUnits = rows.reduce((acc, r) => acc + (r.stock ?? 0), 0);
	$: activeUnits = rows
		.filter((r) => r.status_producto === 'disponible' && r.published)
		.reduce((acc, r) => acc + (r.stock ?? 0), 0);

	async function patchProduct(id: string, patch: Partial<StockRow>) {
		try {
			const res = await fetch(`/api/products/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(patch)
			});

			const json = await res.json().catch(() => ({}));

			if (!res.ok || (json && (json as any).ok === false)) {
				console.error('[stock] error PATCH', json);
				alert('No se pudo guardar el cambio de stock/estado.');
			}
		} catch (err) {
			console.error('[stock] patchProduct error', err);
			alert('Error de red al guardar el stock.');
		}
	}

	function updateRowLocally(id: string, patch: Partial<StockRow>) {
		rows = rows.map((r) =>
			r.product_id === id
				? {
						...r,
						...patch
					}
				: r
		);
	}

	function changeStock(row: StockRow, delta: number) {
		const current = Number(row.stock ?? 0);
		const next = Math.max(0, current + delta);
		if (next === current) return;

		// actualizamos UI (inmutable)
		updateRowLocally(row.product_id, { stock: next });

		// guardamos en backend
		patchProduct(row.product_id, { stock: next });
	}

	function handleStockInput(row: StockRow, value: string) {
		const parsed = Number(value);
		if (Number.isNaN(parsed) || parsed < 0) return;

		updateRowLocally(row.product_id, { stock: parsed });
		patchProduct(row.product_id, { stock: parsed });
	}

	async function handleStatusChange(row: StockRow, value: string) {
		updateRowLocally(row.product_id, { status_producto: value });
		await patchProduct(row.product_id, { status_producto: value });
	}

	async function handlePublishedToggle(row: StockRow) {
		const next = !row.published;
		updateRowLocally(row.product_id, { published: next });
		await patchProduct(row.product_id, { published: next });
	}
</script>

<section class="stock-page">
	<header class="stock-header">
		<div>
			<h1>📦 Stock</h1>
			<p>Resumen de stock por modelo y talla. Editas cada fila desde aquí.</p>
		</div>

		<div class="metrics">
			<div class="metric">
				<span class="metric-label">Modelos / tallas</span>
				<span class="metric-value">{totalPairs}</span>
			</div>
			<div class="metric">
				<span class="metric-label">Unidades totales</span>
				<span class="metric-value">{totalUnits}</span>
			</div>
			<div class="metric">
				<span class="metric-label">Unidades activas</span>
				<span class="metric-value">{activeUnits}</span>
			</div>
		</div>
	</header>

	<div class="stock-toolbar">
		<input
			class="search"
			type="search"
			placeholder="Buscar por modelo, marca o talla"
			bind:value={query}
		/>

		<select bind:value={brandFilter}>
			<option value="all">Todas las marcas</option>
			<option value="Nike">Nike</option>
			<option value="Adidas">Adidas</option>
		</select>

		<select bind:value={stateFilter}>
			<option value="all">Todos los estados</option>
			<option value="disponible">Solo disponibles</option>
			<option value="agotado">Agotado</option>
		</select>
	</div>

	<div class="table-wrapper">
		<table class="stock-table">
			<thead>
				<tr>
					<th>MODELO</th>
					<th>MARCA</th>
					<th>TALLA</th>
					<th class="col-stock">STOCK</th>
					<th>ESTADO</th>
					<th>PUBLICADO</th>
					<th>ACCIONES</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRows as row}
					<tr>
						<td>
							<span class="modelo-pill">{row.modelo_slug}</span>
							<div class="modelo-name">{row.nombre}</div>
						</td>
						<td>{row.marca}</td>
						<td>{row.talla}</td>

						<!-- STOCK -->
						<td class="col-stock">
							<div class="stock-control">
								<button
									type="button"
									on:click={() => changeStock(row, -1)}
									aria-label="Restar stock"
								>
									−
								</button>

								<input
									type="number"
									min="0"
									value={row.stock}
									on:change={(e) =>
										handleStockInput(row, (e.currentTarget as HTMLInputElement).value)}
								/>

								<button type="button" on:click={() => changeStock(row, 1)} aria-label="Sumar stock">
									+
								</button>
							</div>
						</td>

						<!-- ESTADO -->
						<td>
							<select
								class="estado-select"
								bind:value={row.status_producto}
								on:change={(e) =>
									handleStatusChange(row, (e.currentTarget as HTMLSelectElement).value)}
							>
								<option value="disponible">disponible</option>
								<option value="agotado">agotado</option>
								<option value="reservado">reservado</option>
							</select>
						</td>

						<!-- PUBLICADO -->
						<td>
							<button
								type="button"
								class="published-pill"
								class:published={row.published}
								on:click={() => handlePublishedToggle(row)}
							>
								{row.published ? 'Sí' : 'No'}
							</button>
						</td>

						<td>
							<a href={`/admin/products/${row.product_id}`}>Editar</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<p class="table-footer">
			{filteredRows.length} filas visibles
		</p>
	</div>
</section>

<style>
	.stock-page {
		padding: 24px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.stock-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		margin-bottom: 16px;
	}

	.stock-header h1 {
		font-size: 24px;
		margin: 0 0 4px;
	}

	.stock-header p {
		margin: 0;
		font-size: 14px;
		opacity: 0.8;
	}

	.metrics {
		display: flex;
		gap: 12px;
	}

	.metric {
		padding: 8px 12px;
		border-radius: 999px;
		background: #f5f5f5;
		font-size: 12px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.metric-label {
		opacity: 0.7;
	}

	.metric-value {
		font-weight: 600;
	}

	.stock-toolbar {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
		align-items: center;
	}

	.stock-toolbar .search {
		flex: 1;
		border-radius: 999px;
		border: 1px solid #ddd;
		padding: 8px 12px;
		font-size: 14px;
	}

	.stock-toolbar select {
		border-radius: 999px;
		border: 1px solid #ddd;
		padding: 6px 10px;
		font-size: 14px;
		background: #fff;
	}

	.table-wrapper {
		border-radius: 16px;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
	}

	.stock-table {
		width: 100%;
		border-collapse: collapse;
	}

	.stock-table th,
	.stock-table td {
		padding: 10px 16px;
		font-size: 14px;
		border-bottom: 1px solid #eee;
	}

	.stock-table thead {
		background: #fafafa;
		text-align: left;
	}

	.col-stock {
		text-align: center;
		width: 180px;
	}

	.modelo-pill {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 999px;
		background: #f1f1f1;
		font-size: 11px;
		text-transform: lowercase;
		opacity: 0.8;
	}

	.modelo-name {
		margin-top: 2px;
	}

	.stock-control {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 8px;
		border-radius: 999px;
		background: #f7f7f7;
		border: 1px solid #e2e2e2;
	}

	.stock-control button {
		width: 24px;
		height: 24px;
		border-radius: 999px;
		border: 1px solid #ddd;
		background: #fff;
		cursor: pointer;
		font-size: 16px;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stock-control input {
		width: 40px;
		border: none;
		background: transparent;
		text-align: center;
		font-size: 14px;
		padding: 0;
	}

	.stock-control input:focus {
		outline: none;
	}

	.estado-select {
		border-radius: 999px;
		border: 1px solid #ddd;
		padding: 4px 8px;
		font-size: 13px;
		background: #fff;
	}

	.published-pill {
		border-radius: 999px;
		padding: 4px 10px;
		border: 1px solid #ddd;
		font-size: 13px;
		background: #f5f5f5;
		cursor: pointer;
	}

	.published-pill.published {
		background: #e6f7ea;
		border-color: #b8e3c2;
	}

	.table-footer {
		margin: 0;
		padding: 8px 16px 10px;
		font-size: 12px;
		opacity: 0.7;
	}

	@media (max-width: 900px) {
		.stock-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.metrics {
			width: 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
		}

		.col-stock {
			width: 150px;
		}
	}
</style>