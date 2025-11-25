<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // ✅ props
  export let imageUrl: string = '';
  export let productId: string | null = null;

  // los dos de abajo son opcionales, pero así no te marca error al pasarlos
  export let bucket: string = 'productos';
  export let folder: string | null = null;

  const dispatch = createEventDispatcher<{
    uploaded: { url: string; id: string };
  }>();

  let uploading = false;
  let errorMsg = '';

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    errorMsg = '';

    // ⚠️ Validar tipo (decidimos usar solo estos formatos)
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMsg = 'Solo se permiten imágenes JPG, PNG o WEBP.';
      return;
    }

    if (!productId) {
      errorMsg = 'No hay productId definido aún. Guarda primero el producto.';
      return;
    }

    uploading = true;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('product_id', productId);
      formData.append('bucket', bucket);
      if (folder) formData.append('folder', folder);

      const res = await fetch('/admin/products/upload-image', {
        method: 'POST',
        body: formData
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok || !json.url) {
        console.error('[ImageUploader] upload error', json);
        errorMsg = json.error ?? 'No se pudo subir la imagen.';
        return;
      }

      // URL principal (si lo usas con bind:imageUrl)
      imageUrl = json.url;

      // ✅ avisamos al padre para que refresque la galería
      dispatch('uploaded', { url: json.url, id: json.id });
    } catch (err) {
      console.error('[ImageUploader] unexpected error', err);
      errorMsg = 'No se pudo subir la imagen.';
    } finally {
      uploading = false;
    }
  }

  function onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    handleFiles(target.files);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    handleFiles(event.dataTransfer?.files ?? null);
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
  }
</script>

<div class="uploader">
  <label
    class="dropzone"
    on:drop={onDrop}
    on:dragover={onDragOver}
  >
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      on:change={onInputChange}
      hidden
    />
    <p>
      {#if uploading}
        Subiendo imagen…
      {:else}
        Arrastra una imagen aquí o haz clic para seleccionarla
      {/if}
    </p>
 <p class="hint">
  Recomendado: WEBP o JPG, cuadrado (~1200×1200px, máx. 1MB).
</p>
  </label>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  {#if imageUrl}
    <p class="small">Imagen subida correctamente.</p>
  {/if}
</div>

<style>
  .uploader {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dropzone {
    border: 1px dashed #999;
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    background: #fafafa;
  }

  .dropzone:hover {
    background: #f3f3f3;
  }

  .hint {
    margin-top: 8px;
    font-size: 12px;
    opacity: 0.7;
  }

  .error {
    color: #b00020;
    font-size: 13px;
  }

  .small {
    font-size: 13px;
    opacity: 0.8;
  }
</style>