<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  // Tipo del producto embebido dentro del lead
  type LeadProduct = {
    nombre: string;
    marca: string;
    precio_publicado: number;
  };

  // Tipo de fila de lead (simplificado)
  type LeadRow = {
    lead_id: string;
    product_id: string;
    size: string | null;
    status: string;
    channel: string;
    created_at: string;
    notes: string | null;
    // Supabase lo tipa como objeto o array, así que cubrimos ambos
    products?: LeadProduct | LeadProduct[];
  };

  const leads = (data.leads ?? []) as LeadRow[];
  const statusOptions = ['new', 'contacted', 'closed'];

  // Helper para sacar SIEMPRE un único producto (o null)
  function getLeadProduct(lead: LeadRow): LeadProduct | null {
    const p = lead.products;
    if (!p) return null;
    return Array.isArray(p) ? p[0] : p;
  }
</script>

<section class="admin-page">
  <header class="admin-header">
    <h1>Leads</h1>
    <p>Clicks en WhatsApp y contactos del catálogo.</p>
  </header>

  {#if !leads.length}
    <p>Todavía no hay leads registrados.</p>
  {:else}
    <table class="admin-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Talla</th>
          <th>Canal</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {#each leads as lead}
          <tr>
            <td>{new Date(lead.created_at).toLocaleString()}</td>
            <td>
              {#if getLeadProduct(lead)}
                <strong>{getLeadProduct(lead)!.nombre}</strong>
                <span class="muted">
                  {' '}· {getLeadProduct(lead)!.marca}
                </span>
              {:else}
                <span class="muted">[Producto borrado]</span>
              {/if}
            </td>
            <td>{lead.size ?? '—'}</td>
            <td>{lead.channel}</td>
            <td>
              <form method="POST" action="?/updateStatus">
                <input type="hidden" name="lead_id" value={lead.lead_id} />
                <select
                  name="status"
                  on:change={(e) => e.currentTarget.form?.submit()}
                >
                  {#each statusOptions as opt}
                    <option value={opt} selected={opt === lead.status}>
                      {opt}
                    </option>
                  {/each}
                </select>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  .admin-page {
    padding: 32px 48px;
  }

  .admin-header h1 {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .admin-header p {
    font-size: 14px;
    color: #555;
    margin-bottom: 24px;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .admin-table th,
  .admin-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  .admin-table th {
    font-weight: 600;
    background: #f5f5f5;
  }

  .muted {
    color: #777;
    font-size: 12px;
  }

  select {
    font-size: 13px;
    padding: 4px 6px;
  }
</style>