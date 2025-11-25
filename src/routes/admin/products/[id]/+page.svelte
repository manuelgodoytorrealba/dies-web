<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  const p = data.product;
</script>

<section class="admin-edit">
  <h1>Editar producto</h1>

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
      <input name="categoria" value={p.categoria ?? ''} placeholder="zapatillas / ropa / accesorios" />
    </label>

    <label>
      Precio publicado (€)
      <input type="number" step="0.01" name="precio_publicado" value={p.precio_publicado ?? 0} />
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
</section>

<style>
  .admin-edit {
    max-width: 720px;
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

  .published-row input[type='checkbox'] {
    width: auto;
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
</style>