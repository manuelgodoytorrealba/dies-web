<script lang="ts">
  import type { PageData } from './$types';

  // Recibimos los datos que vienen de +layout.server.ts
  export let data: PageData;

  const { user } = data;
</script>

<section class="admin">
  <h1>Panel de administración</h1>
  <p>Bienvenido, <strong>{user.email}</strong></p>

  <div class="grid">
    <a class="card" href="/admin/products">
      <h2>🧾 Productos</h2>
      <p>Ver, crear y editar productos del catálogo.</p>
    </a>

    <a class="card disabled" href="#soon">
      <h2>📦 Stock (próximamente)</h2>
      <p>Control de stock y estado de los productos.</p>
    </a>

    <a class="card disabled" href="#soon">
      <h2>📊 Leads (próximamente)</h2>
      <p>Ver contactos interesados provenientes de WhatsApp.</p>
    </a>
  </div>
</section>

<style>
  .admin {
    padding: 24px;
    max-width: 960px;
    margin: 0 auto;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 24px;
    opacity: 0.8;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 16px;
    text-decoration: none;
    color: inherit;
    background: #fff;
    transition: transform 0.08s ease, box-shadow 0.08s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }

  .card h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  .card p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }

  .card.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
</style>