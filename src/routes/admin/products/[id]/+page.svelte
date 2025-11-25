<script lang="ts">
  import type { PageData } from './$types';
  import ImageUploader from '$lib/components/catalog/ImageUploader.svelte';

  export let data: PageData;

  // Tipado de las imágenes
  type ProductImage = {
    id: string;
    url: string;
    orden?: number | null;
  };

  // Producto cargado desde load()
  const p = data.product;
  const productId = p.product_id;   // ← MUY IMPORTANTE

  // Imágenes cargadas desde la BD
  let images: ProductImage[] = (data as PageData & { images?: ProductImage[] }).images ?? [];

  // Para nuevas imágenes subidas
  let newImageUrl = '';

  // Cuando una imagen se sube correctamente
  function handleImageUploaded(event: CustomEvent<{ url: string }>) {
    newImageUrl = event.detail.url;

    // Opcional: añade la imagen localmente para no recargar la página
    images = [
      ...images,
      {
        id: crypto.randomUUID(),
        url: event.detail.url,
        orden: images.length
      }
    ];
  }
</script>

<section class="admin-edit">
  <h1>Editar producto</h1>

  <!-- =======================
       FORMULARIO PRINCIPAL
       ======================= -->
  <form method="POST" class="card">
    <label>
      Slug
      <input name="slug" value={p.slug ?? ''} />
    </label>

    <label>
      Nombre
      <input name="nombre" value={p.nombre ?? ''} required />
    </label>

    <label>
      Descripción
      <textarea name="descripcion" rows="3">{p.descripcion ?? ''}</textarea>
    </label>

    <label>
      Marca
      <input name="marca" value={p.marca ?? ''} required />
    </label>

    <label>
      Categoría
      <input
        name="categoria"
        value={p.categoria ?? ''}
        placeholder="zapatillas / ropa / accesorios"
      />
    </label>

    <label>
      Precio publicado (€)
      <input
        type="number"
        step="0.01"
        name="precio_publicado"
        value={p.precio_publicado ?? 0}
      />
    </label>

    <label>
      Talla
      <input name="talla" value={p.talla ?? ''} />
    </label>

    <label>
      Stock
      <input type="number" name="stock" value={p.stock ?? 0} />
    </label>

    <label>
      Imagen URL
      <input name="imagen_url" value={p.imagen_url ?? ''} />
    </label>

    <label class="published-row">
      <input type="checkbox" name="published" checked={p.published} />
      Publicado
    </label>

    <div class="actions">
      <button type="submit" name="intent" value="save" class="btn-primary">
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

  <!-- =======================
       GALERÍA DE IMÁGENES
       ======================= -->
  <section class="gallery">
    <h2>Imágenes del producto</h2>

    {#if images.length === 0}
      <p class="empty">Este producto todavía no tiene imágenes en la galería.</p>
    {:else}
      <ul class="gallery-list">
        {#each images as img}
          <li>
            <img src={img.url} alt={p.nombre} />
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
        on:uploaded={handleImageUploaded}
        productId={productId}
      />
    {/if}

    {#if newImageUrl}
      <p class="small">Última imagen subida:</p>
      <img class="preview" src={newImageUrl} alt="Previsualización" />
    {/if}
  </section>
</section>

<style>
  .admin-edit {
    max-width: 960px;
    margin: 24px auto;
    padding: 0 16px;
  }

  h1 {
    margin-bottom: 16px;
  }

  .card {
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fff;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    font-size: 14px;
  }

  input,
  textarea {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid #444;
    font-size: 14px;
  }

  .published-row {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
  }

  .btn-primary,
  .btn-danger {
    flex: 1;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #111;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-primary {
    background: #111;
    color: #fff;
  }

  .btn-danger {
    background: #fff;
    color: #b00020;
    border-color: #b00020;
  }

  .gallery {
    margin-top: 32px;
    border-top: 1px solid #eee;
    padding-top: 16px;
  }

  .gallery-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 12px 0;
    padding: 0;
    list-style: none;
  }

  .gallery-list li {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .gallery-list img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .empty {
    font-size: 14px;
    opacity: 0.7;
  }

  .small {
    font-size: 13px;
  }

  .preview {
    margin-top: 8px;
    max-width: 240px;
    border-radius: 10px;
    border: 1px solid #ddd;
  }
</style>