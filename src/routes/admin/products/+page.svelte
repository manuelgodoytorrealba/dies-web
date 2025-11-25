<script lang="ts">
  import type { PageData as BasePageData } from './$types';
  import type { Product } from '$lib/types/product';

  // extendemos el tipo generado con la propiedad `products`
  type PageData = BasePageData & {
    products: Product[];
  };

  export let data: PageData;

  const products = data.products ?? [];
</script>

<section class="admin-products">
  <div class="topbar">
    <h1>Productos</h1>
    <a class="btn-primary" href="/admin/products/new">+ Nuevo producto</a>
  </div>

  {#if products.length === 0}
    <p>No hay productos todavía.</p>
  {:else}
    <table class="list">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Marca</th>
          <th>Precio</th>
          <th>Talla</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {#each products as p}
          <tr>
            <td>
              <img src={p.imagen_url} alt={p.nombre} width="60" />
            </td>
            <td>{p.nombre}</td>
            <td>{p.marca}</td>
            <td>€{p.precio_publicado}</td>
            <td>{p.talla}</td>
            <td>
              <a href={`/admin/products/${p.product_id}`}>Editar</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>