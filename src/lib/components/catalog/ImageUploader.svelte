<script lang="ts">
  // Solo necesitamos exponer imageUrl para poder hacer bind:imageUrl
  export let imageUrl: string = '';

  let uploading = false;
  let errorMsg = '';

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    errorMsg = '';

    // Validar tipo
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMsg = 'Solo se permiten imágenes JPG, PNG o WEBP.';
      return;
    }

    uploading = true;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/admin/products/upload-image', {
        method: 'POST',
        body: formData
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok || !json.url) {
        console.error('[ImageUploader] upload error', json);
        errorMsg = json.error ?? 'No se pudo subir la imagen.';
        uploading = false;
        return;
      }

      // URL pública devuelta por el endpoint
      imageUrl = json.url;
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

  .error {
    color: #b00020;
    font-size: 13px;
  }

  .small {
    font-size: 13px;
    opacity: 0.8;
  }
</style>