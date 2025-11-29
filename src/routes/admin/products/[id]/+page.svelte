<script lang="ts">
  import type { PageData } from './$types';
  import ImageUploader from '$lib/components/catalog/ImageUploader.svelte';
  import { goto } from '$app/navigation';

  export let data: PageData;

  type ProductImage = {
    id: string;
    url: string;
    orden?: number | null;
  };

  // Producto
  const p = data.product;
  const productId: string = p.product_id;

  // Imágenes traídas desde la BD
  let images: ProductImage[] =
    (data as PageData & { images?: ProductImage[] }).images ?? [];

  // Última imagen subida
  let newImageUrl = '';

  function handleImageUploaded(event: CustomEvent<{ url: string; id?: string }>) {
    newImageUrl = event.detail.url;

    // Añadimos la imagen a la galería local sin recargar
    images = [
      ...images,
      {
        id: event.detail.id ?? crypto.randomUUID(),
        url: event.detail.url,
        orden: images.length
      }
    ];
  }

  function volverAProductos() {
    goto('/admin/products');
  }
</script>

<section class="edit-page">
  <header class="page-header">
    <div>
      <h1>Editar producto</h1>
      <p class="subtitle">
        {p.nombre} · {p.marca} · Talla {p.talla}
      </p>
      <p class="meta">ID: {p.product_id}</p>
    </div>

    <button type="button" class="btn-ghost" on:click={volverAProductos}>
      ← Volver a productos
    </button>
  </header>

  <div class="layout">
    <!-- ========== FORMULARIO PRINCIPAL ========== -->
    <section class="card form-card">
      <form method="POST" class="form-grid">
        <!-- Nombre -->
        <div class="field-group field-full">
          <label for="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={p.nombre ?? ''}
            required
          />
        </div>

        <!-- Slug -->
        <div class="field-group field-full">
          <div class="label-row">
            <label for="slug">Slug</label>
            <span class="label-hint">URL amigable del producto.</span>
          </div>
          <input
            id="slug"
            name="slug"
            value={p.slug ?? ''}
          />
        </div>

        <!-- Descripción -->
        <div class="field-group field-full">
          <label for="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
          >{p.descripcion ?? ''}</textarea>
        </div>

        <!-- Precio / Talla / Stock -->
        <div class="field-group">
          <label for="precio_publicado">Precio publicado (€)</label>
          <input
            id="precio_publicado"
            type="number"
            step="0.01"
            min="0"
            name="precio_publicado"
            value={p.precio_publicado ?? 0}
          />
        </div>

        <div class="field-group">
          <label for="talla">Talla</label>
          <input
            id="talla"
            name="talla"
            value={p.talla ?? ''}
          />
        </div>

        <div class="field-group">
          <label for="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            name="stock"
            value={p.stock ?? 0}
          />
        </div>

        <!-- Imagen URL -->
        <div class="field-group field-full">
          <div class="label-row">
            <label for="imagen_url">Imagen URL (portada)</label>
            <span class="label-hint">
              Si está vacía, se usará la primera imagen subida.
            </span>
          </div>
          <input
            id="imagen_url"
            name="imagen_url"
            value={p.imagen_url ?? ''}
            placeholder="https://..."
          />
        </div>

        <!-- Marca / Categoría -->
        <div class="field-group">
          <label for="marca">Marca</label>
          <input
            id="marca"
            name="marca"
            value={p.marca ?? ''}
            required
          />
        </div>

        <div class="field-group">
          <div class="label-row">
            <label for="categoria">Categoría</label>
            <span class="label-hint">zapatillas / ropa / accesorios…</span>
          </div>
          <input
            id="categoria"
            name="categoria"
            value={p.categoria ?? ''}
            placeholder="zapatillas"
          />
        </div>

        <!-- Publicado -->
        <div class="field-group field-full">
          <label class="published-row">
            <input type="checkbox" name="published" checked={p.published} />
            Publicado en catálogo
          </label>
        </div>

        <!-- Acciones -->
        <div class="actions-row">
          <button
            type="submit"
            name="intent"
            value="save"
            class="btn-primary"
          >
            Guardar cambios
          </button>

          <button
            type="submit"
            name="intent"
            value="delete"
            class="btn-danger"
            on:click={(e) => {
              if (!confirm('¿Seguro que quieres eliminar este producto?')) {
                e.preventDefault();
              }
            }}
          >
            Eliminar
          </button>
        </div>
      </form>
    </section>

    <!-- ========== GALERÍA DE IMÁGENES ========== -->
    <section class="card images-card">
      <h2>Imágenes</h2>
      {#if images.length === 0}
        <p class="empty">Este producto todavía no tiene imágenes en la galería.</p>
      {:else}
        <ul class="gallery-list">
          {#each images as img}
            <li>
              <img src={img.url} alt={p.nombre} loading="lazy" />
            </li>
          {/each}
        </ul>
      {/if}

      <h3>Añadir nuevas imágenes</h3>

      {#if !productId}
        <p class="empty">Guarda el producto antes de subir imágenes.</p>
      {:else}
        <ImageUploader
          bind:imageUrl={newImageUrl}
          productId={productId}
          bucket="productos"
          folder={`admin/${productId}`}
          on:uploaded={handleImageUploaded}
        />
      {/if}

      {#if newImageUrl}
        <p class="small">Última imagen subida:</p>
        <img class="preview" src={newImageUrl} alt="Previsualización" />
      {/if}
    </section>
  </div>
</section>

<style>
  .edit-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-header h1 {
    margin: 0 0 4px;
    font-size: 26px;
  }

  .subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.85;
  }

  .meta {
    margin: 2px 0 0;
    font-size: 12px;
    opacity: 0.7;
  }

  .btn-ghost {
    border-radius: 999px;
    border: 1px solid #ddd;
    padding: 8px 16px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.2fr);
    gap: 16px;
  }

  .card {
    border-radius: 18px;
    background: #fff;
    padding: 20px 20px 18px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 16px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  label {
    font-weight: 600;
    color: #000;
  }

  .label-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .label-hint {
    font-weight: 400;
    font-size: 12px;
    opacity: 0.7;
  }

  input,
  textarea {
    padding: 9px 12px;
    border-radius: 12px;
    border: 1px solid #d0d0d0;
    font-size: 14px;
    background: #f9fbff;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #111;
    background: #fff;
  }

  .published-row {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .actions-row {
    grid-column: 1 / -1;
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .btn-primary,
  .btn-danger {
    flex: 1;
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .btn-primary {
    background: #111;
    color: #fff;
    border-color: #111;
  }

  .btn-danger {
    background: #fff;
    color: #b00020;
    border-color: #b00020;
  }

  .images-card h2 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .images-card h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-size: 15px;
  }

  .empty {
    font-size: 13px;
    opacity: 0.75;
    margin: 4px 0 10px;
  }

  .gallery-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 8px 0 12px;
    padding: 0;
    list-style: none;
  }

  .gallery-list li {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
  }

  .gallery-list img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .small {
    font-size: 13px;
    opacity: 0.8;
  }

  .preview {
    margin-top: 6px;
    max-width: 240px;
    border-radius: 12px;
    border: 1px solid #eee;
    display: block;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>