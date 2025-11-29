<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  type StockRow = {
    product_id: string;
    modelo_slug: string | null;
    nombre: string;
    marca: string;
    talla: string | number | null;
    stock: number | null;
    status_producto: string;
    published: boolean;
    created_at: string;
  };

  // 👇 Arreglo del error de tipos
  const rawItems = (data as any)?.items ?? [];
  const items: StockRow[] = Array.isArray(rawItems) ? (rawItems as StockRow[]) : [];


  let query = '';

  // Filtro simple por texto (modelo, nombre, marca, talla)
  $: normalizedQuery = query.trim().toLowerCase();

  $: filtered =
    normalizedQuery === ''
      ? items
      : items.filter((row) => {
          const haystack = [
            row.modelo_slug ?? '',
            row.nombre ?? '',
            row.marca ?? '',
            row.talla ?? ''
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        });

  // Pequeña etiqueta de estado
  function statusLabel(row: StockRow) {
    if (!row.published) return 'Borrador';
    if (row.status_producto === 'agotado') return 'Agotado';
    if ((row.stock ?? 0) <= 0) return 'Sin stock';
    return 'Activo';
  }

  function statusClass(row: StockRow) {
    if (!row.published) return 'badge badge--draft';
    if (row.status_producto === 'agotado' || (row.stock ?? 0) <= 0)
      return 'badge badge--danger';
    return 'badge badge--ok';
  }
</script>

<section class="stock">
  <header class="stock__header">
    <div>
      <h1>📦 Stock</h1>
      <p>Resumen de stock por modelo y talla. Editas cada fila desde productos.</p>
    </div>

    <div class="stock__search">
      <input
        type="search"
        placeholder="Buscar por modelo, marca o talla…"
        bind:value={query}
      />
      <span class="stock__count">
        {filtered.length} filas
      </span>
    </div>
  </header>

  {#if filtered.length === 0}
    <p class="stock__empty">No hay productos que coincidan con la búsqueda.</p>
  {:else}
    <div class="stock__table-wrapper">
      <table class="stock__table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Talla</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Publicado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as row}
            <tr>
              <td class="col-model">
                <div class="col-model__slug">
                  <code>{row.modelo_slug ?? '—'}</code>
                </div>
                <div class="col-model__name">
                  {row.nombre}
                </div>
              </td>

              <td>{row.marca}</td>

              <td class="col-size">
                {row.talla ?? '—'}
              </td>

              <td class="col-stock">
                {row.stock ?? 0}
              </td>

              <td>
                <span class={statusClass(row)}>
                  {statusLabel(row)}
                </span>
              </td>

              <td>
                {#if row.published}
                  <span class="pill pill--yes">Sí</span>
                {:else}
                  <span class="pill pill--no">No</span>
                {/if}
              </td>

              <td>
                <a
                  class="link-edit"
                  href={`/admin/products/${row.product_id}`}
                >
                  Editar
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .stock {
    padding: 24px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .stock__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    margin-bottom: 16px;
  }

  .stock__header h1 {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .stock__header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }

  .stock__search {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stock__search input {
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid #ddd;
    font-size: 14px;
    min-width: 220px;
  }

  .stock__count {
    font-size: 13px;
    opacity: 0.7;
  }

  .stock__empty {
    margin-top: 24px;
    font-size: 14px;
    opacity: 0.7;
  }

  .stock__table-wrapper {
    margin-top: 12px;
    border-radius: 12px;
    border: 1px solid #eee;
    overflow: hidden;
    background: #fff;
  }

  .stock__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .stock__table thead {
    background: #fafafa;
  }

  .stock__table th,
  .stock__table td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f1f1;
    text-align: left;
  }

  .stock__table th {
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stock__table tbody tr:hover {
    background: #fcfcfc;
  }

  .col-model {
    max-width: 260px;
  }

  .col-model__slug code {
    font-size: 11px;
    background: #f3f3f3;
    padding: 2px 6px;
    border-radius: 6px;
  }

  .col-model__name {
    margin-top: 4px;
    font-weight: 500;
  }

  .col-size,
  .col-stock {
    text-align: center;
    width: 80px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
  }

  .badge--ok {
    background: #e7f8e9;
    color: #0f7a28;
  }

  .badge--danger {
    background: #fde8e8;
    color: #b42318;
  }

  .badge--draft {
    background: #f3f4ff;
    color: #3730a3;
  }

  .pill {
    display: inline-flex;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
  }

  .pill--yes {
    background: #ecfdf3;
    color: #166534;
  }

  .pill--no {
    background: #f4f4f5;
    color: #3f3f46;
  }

  .link-edit {
    font-size: 13px;
    text-decoration: none;
    color: #111;
    border-bottom: 1px solid transparent;
  }

  .link-edit:hover {
    border-color: #111;
  }

  @media (max-width: 768px) {
    .stock {
      padding: 16px;
    }

    .stock__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .stock__search input {
      min-width: 0;
      width: 100%;
    }

    .stock__table {
      font-size: 13px;
    }

    .stock__table-wrapper {
      overflow-x: auto;
    }
  }
</style>