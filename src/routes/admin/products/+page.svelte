<script lang="ts">
  import type { PageData as BasePageData } from './$types';
  import type { Product } from '$lib/types/product';

  // Extendemos el Product original con campos que vienen de la BD
  type AdminProduct = Product & {
    modelo_slug?: string | null;
  };

  type PageData = BasePageData & {
    products: AdminProduct[];
  };

  export let data: PageData;

  let products: AdminProduct[] = data.products ?? [];

  // ---- filtros / métricas ----
  let query = '';
  let brandFilter = 'all';
  let publishedFilter = 'all';

  // opciones de marcas dinámicas
  $: brandOptions = Array.from(
    new Set(
      products
        .map((p) => p.marca)
        .filter((m): m is string => !!m)
    )
  ).sort();

  $: filtered = products
    .filter((p) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        (p.modelo_slug ?? '').toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        String(p.talla ?? '').includes(q)
      );
    })
    .filter((p) =>
      brandFilter === 'all' ? true : p.marca.toLowerCase() === brandFilter.toLowerCase()
    )
    .filter((p) =>
      publishedFilter === 'all'
        ? true
        : publishedFilter === 'published'
        ? p.published
        : !p.published
    );

  // métricas
  $: totalProducts = products.length;
  $: publishedCount = products.filter((p) => p.published).length;
  $: draftCount = totalProducts - publishedCount;

  // ---- helpers para PATCH ----
  async function patchProduct(id: string, patch: Partial<AdminProduct>) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || (json && (json as any).ok === false)) {
        console.error('[admin/products] PATCH error', json);
        alert('No se pudo guardar el cambio.');
      }
    } catch (err) {
      console.error('[admin/products] patchProduct error', err);
      alert('Error de red al guardar el producto.');
    }
  }

  function updateProductLocally(id: string, patch: Partial<AdminProduct>) {
    products = products.map((p) =>
      p.product_id === id
        ? {
            ...p,
            ...patch
          }
        : p
    );
  }

  async function togglePublished(p: AdminProduct) {
    const next = !p.published;
    updateProductLocally(p.product_id, { published: next });
    await patchProduct(p.product_id, { published: next });
  }
</script>

<section class="admin-products">
  <header class="header">
    <div>
      <h1>🧾 Productos</h1>
      <p>Listado de productos del catálogo. Publica, busca y edita desde aquí.</p>
    </div>

    <div class="header-right">
      <div class="metrics">
        <div class="metric">
          <span class="metric-label">Total</span>
          <span class="metric-value">{totalProducts}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Publicados</span>
          <span class="metric-value">{publishedCount}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Borradores</span>
          <span class="metric-value">{draftCount}</span>
        </div>
      </div>

      <a class="btn-primary" href="/admin/products/new">+ Nuevo producto</a>
    </div>
  </header>

  <div class="toolbar">
    <input
      class="search"
      type="search"
      placeholder="Buscar por modelo, nombre, marca o talla"
      bind:value={query}
    />

    <select bind:value={brandFilter}>
      <option value="all">Todas las marcas</option>
      {#each brandOptions as brand}
        <option value={brand}>{brand}</option>
      {/each}
    </select>

    <select bind:value={publishedFilter}>
      <option value="all">Todos</option>
      <option value="published">Solo publicados</option>
      <option value="drafts">Solo borradores</option>
    </select>
  </div>

  {#if filtered.length === 0}
    <p class="empty">No hay productos que coincidan con el filtro.</p>
  {:else}
    <div class="table-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>PRODUCTO</th>
            <th>MARCA</th>
            <th>MODELO</th>
            <th>TALLA</th>
            <th>PRECIO</th>
            <th>PUBLICADO</th>
            <th class="col-actions-header">ACCIONES</th>
          </tr>
        </thead>

        <tbody>
          {#each filtered as p}
            <tr>
              <td class="col-product">
                <div class="product-cell">
                  <div class="thumb">
                    {#if p.imagen_url}
                      <img src={p.imagen_url} alt={p.nombre} loading="lazy" />
                    {:else}
                      <span class="thumb-placeholder">IMG</span>
                    {/if}
                  </div>
                  <div class="product-text">
                    <div class="product-name">{p.nombre}</div>
                    <div class="product-price">€{p.precio_publicado}</div>
                    <div class="product-id">ID: {p.product_id}</div>
                  </div>
                </div>
              </td>

              <td>{p.marca}</td>
              <td>
                {#if p.modelo_slug}
                  <span class="modelo-pill">{p.modelo_slug}</span>
                {/if}
              </td>
              <td>{p.talla}</td>
              <td>€{p.precio_publicado}</td>

              <td>
                <button
                  type="button"
                  class="published-pill"
                  class:published={p.published}
                  on:click={() => togglePublished(p)}
                >
                  {p.published ? 'Sí' : 'No'}
                </button>
              </td>

              <td class="col-actions">
                <a
                  class="link-secondary"
                  href={`/product/${p.product_id}`}
                  target="_blank"
                  rel="noreferrer"
                  >Ver</a
                >
                <a class="link-primary" href={`/admin/products/${p.product_id}`}>Editar</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <p class="table-footer">
        {filtered.length} productos visibles
      </p>
    </div>
  {/if}
</section>

<style>
  .admin-products {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 16px;
  }

  .header h1 {
    font-size: 24px;
    margin: 0 0 4px;
  }

  .header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }

  .header-right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .metrics {
    display: flex;
    gap: 8px;
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

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 999px;
    background: #111;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
  }

  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }

  .toolbar .search {
    flex: 1;
    border-radius: 999px;
    border: 1px solid #ddd;
    padding: 8px 12px;
    font-size: 14px;
  }

  .toolbar select {
    border-radius: 999px;
    border: 1px solid #ddd;
    padding: 6px 10px;
    font-size: 14px;
    background: #fff;
  }

  .empty {
    margin-top: 24px;
    font-size: 14px;
    opacity: 0.8;
  }

  .table-wrapper {
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
  }

  .products-table th,
  .products-table td {
    padding: 10px 16px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }

  .products-table thead {
    background: #fafafa;
    text-align: left;
  }

  .col-product {
    width: 360px;
  }

  .product-cell {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .thumb {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    background: #f3f3f3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb-placeholder {
    font-size: 11px;
    opacity: 0.7;
  }

  .product-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .product-name {
    font-weight: 500;
  }

  .product-price {
    font-size: 13px;
    opacity: 0.8;
  }

  .product-id {
    font-size: 11px;
    opacity: 0.5;
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

  /* ----- ACCIONES alineadas ----- */

  .col-actions-header {
    width: 130px;
    text-align: right;
  }

  .col-actions {
    width: 130px;
    text-align: right;
    white-space: nowrap; /* evita salto de línea entre Ver / Editar */
  }

  .link-primary,
  .link-secondary {
    font-size: 13px;
    text-decoration: underline;
    cursor: pointer;
  }

  .link-secondary {
    opacity: 0.8;
    margin-right: 8px;
  }

  .table-footer {
    margin: 0;
    padding: 8px 16px 10px;
    font-size: 12px;
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
    }

    .header-right {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .col-product {
      width: auto;
    }
  }
</style>