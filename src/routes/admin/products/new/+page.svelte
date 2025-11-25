<script lang="ts">
  import ImageUploader from '$lib/components/catalog/ImageUploader.svelte';

  // Estado del formulario que (opcionalmente) puede venir del action
  type FormState = {
    message?: string;
    values?: Record<string, any>;
  };

  // SvelteKit inyectará `form` si usas acciones en +page.server.ts.
  // Si no hay action, será null y no pasa nada.
  export let form: FormState | null = null;

  const initial = form?.values ?? {};

  let slug = initial.slug ?? '';
  let nombre = initial.nombre ?? '';
  let descripcion = initial.descripcion ?? '';
  let marca = initial.marca ?? '';
  let precio_publicado = initial.precio_publicado ?? '';
  let talla = initial.talla ?? '';
  let categoria = initial.categoria ?? '';
  let stock = initial.stock ?? 0;
  let published = initial.published ?? false;

  // URL de imagen que se guarda en la tabla
  let imagen_url = initial.imagen_url ?? '';

  // mensaje de error devuelto por el action (si lo hay)
  $: errorMsg = form?.message ?? '';
</script>

<section class="new-product">
  <h1>Nuevo producto</h1>

  <form method="POST">
    <div class="grid">
      <div class="col">
        <label>
          Slug
          <input name="slug" bind:value={slug} required />
        </label>

        <label>
          Nombre
          <input name="nombre" bind:value={nombre} required />
        </label>

        <label>
          Descripción
          <textarea
            name="descripcion"
            rows="3"
            bind:value={descripcion}
          ></textarea>
        </label>

        <label>
          Marca
          <input name="marca" bind:value={marca} required />
        </label>

        <label>
          Precio publicado (€)
          <input
            name="precio_publicado"
            type="number"
            step="0.01"
            min="0"
            bind:value={precio_publicado}
            required
          />
        </label>

        <label>
          Talla
          <input name="talla" bind:value={talla} />
        </label>

        <label>
          Categoría
          <input
            name="categoria"
            placeholder="zapatillas / ropa / accesorios…"
            bind:value={categoria}
          />
        </label>

        <label>
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            bind:value={stock}
          />
        </label>

        <label class="check">
          <input
            type="checkbox"
            name="published"
            bind:checked={published}
          />
          Publicado (visible en el catálogo)
        </label>
      </div>

      <div class="col">
        <h2>Imagen del producto</h2>

        <!-- Subida a Supabase Storage -->
        <ImageUploader bind:imageUrl={imagen_url} />

        {#if imagen_url}
          <p class="preview-label">Preview</p>
          <img class="preview" src={imagen_url} alt={nombre || 'Producto'} />
        {/if}

        <!-- Esta URL es la que llega al +page.server.ts -->
        <input type="hidden" name="imagen_url" value={imagen_url} />
      </div>
    </div>

    {#if errorMsg}
      <p class="error">{errorMsg}</p>
    {/if}

    <div class="actions">
      <button type="submit">Crear</button>
      <a href="/admin/products" class="link-back">Cancelar</a>
    </div>
  </form>
</section>

<style>
  .new-product {
    padding: 24px;
    max-width: 960px;
    margin: 0 auto;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 24px;
    align-items: flex-start;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    border-radius: 8px;
    border: 1px solid #444;
    font-size: 14px;
  }

  textarea {
    resize: vertical;
  }

  .check {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .check input {
    width: auto;
  }

  .error {
    color: #b00020;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  button {
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    background: #111;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.85;
  }

  .link-back {
    font-size: 14px;
    text-decoration: none;
    color: #333;
  }

  .link-back:hover {
    text-decoration: underline;
  }

  .preview-label {
    margin-top: 12px;
    font-size: 13px;
    opacity: 0.8;
  }

  .preview {
    margin-top: 6px;
    width: 240px;
    max-height: 240px;
    object-fit: contain;
    border-radius: 12px;
    border: 1px solid #eee;
    background: #fafafa;
  }

  @media (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>