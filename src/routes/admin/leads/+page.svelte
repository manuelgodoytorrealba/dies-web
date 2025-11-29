<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  type LeadRow = {
    lead_id: string;
    product_id: string;
    size: string | null;
    status: string;
    channel: string | null;
    created_at: string;
    notes: string | null;
    product_name_snapshot: string | null;
    product_price_snapshot: number | null;
    product_slug_snapshot: string | null;
    source_page: string | null;
  };

  const leads = (data.leads ?? []) as LeadRow[];

  const statusOptions = ['new', 'contacted', 'closed'];

  // Métricas rápidas
  $: totalLeads = leads.length;
  $: newLeads = leads.filter((l) => l.status === 'new').length;
  $: contactedLeads = leads.filter((l) => l.status === 'contacted').length;
  $: closedLeads = leads.filter((l) => l.status === 'closed').length;

  // DEBUG opcional (puedes quitarlo cuando veas las filas)
  console.log('[Leads UI] leads:', leads);
</script>

<section class="admin-page">
  <header class="admin-header">
    <div>
      <h1>📊 Leads</h1>
      <p>Clicks en WhatsApp y contactos generados desde el catálogo.</p>
    </div>

    <div class="metrics">
      <div class="metric-pill">
        <span class="label">Total leads</span>
        <span class="value">{totalLeads}</span>
      </div>
      <div class="metric-pill">
        <span class="label">Nuevos</span>
        <span class="value">{newLeads}</span>
      </div>
      <div class="metric-pill">
        <span class="label">Contactados</span>
        <span class="value">{contactedLeads}</span>
      </div>
      <div class="metric-pill">
        <span class="label">Cerrados</span>
        <span class="value">{closedLeads}</span>
      </div>
    </div>
  </header>

  {#if !leads.length}
    <p class="empty">Todavía no hay leads registrados.</p>
  {:else}
    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Talla</th>
            <th>Canal</th>
            <th>Estado</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {#each leads as lead}
            <tr>
              <td>{new Date(lead.created_at).toLocaleString()}</td>

              <td>
                {#if lead.product_name_snapshot}
                  <div class="product-main">
                    <strong>{lead.product_name_snapshot}</strong>
                  </div>
                  {#if lead.product_price_snapshot !== null}
                    <div class="product-sub">
                      €{lead.product_price_snapshot}
                    </div>
                  {/if}
                {:else}
                  <div class="product-main">
                    <strong>ID: {lead.product_id.slice(0, 8)}…</strong>
                  </div>
                  <div class="product-sub muted">
                    (snapshot vacío)
                  </div>
                {/if}
              </td>

              <td>{lead.size ?? '—'}</td>
              <td>{lead.channel ?? '—'}</td>

              <td>
                <form method="POST" action="?/updateStatus" class="status-form">
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

              <td>
                {#if lead.source_page}
                  <span class="pill">{lead.source_page}</span>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .admin-page {
    padding: 32px 48px;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 18px;
  }

  .admin-header h1 {
    font-size: 24px;
    margin: 0 0 4px;
  }

  .admin-header p {
    font-size: 14px;
    color: #555;
    margin: 0;
  }

  .metrics {
    display: flex;
    gap: 8px;
  }

  .metric-pill {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 6px 12px;
    border-radius: 999px;
    background: #f5f5f5;
    font-size: 11px;
  }

  .metric-pill .label {
    opacity: 0.7;
  }

  .metric-pill .value {
    font-weight: 600;
    font-size: 13px;
  }

  .empty {
    margin-top: 24px;
    font-size: 14px;
    opacity: 0.8;
  }

  .table-wrapper {
    margin-top: 12px;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .admin-table th,
  .admin-table td {
    padding: 10px 16px;
    border-bottom: 1px solid #eee;
    text-align: left;
    vertical-align: middle;
  }

  .admin-table thead {
    background: #fafafa;
  }

  .product-main {
    font-size: 14px;
  }

  .product-sub {
    font-size: 12px;
    opacity: 0.8;
  }

  .muted {
    color: #777;
    font-size: 12px;
  }

  .status-form select {
    font-size: 13px;
    padding: 4px 6px;
    border-radius: 999px;
    border: 1px solid #ddd;
    background: #fff;
  }

  .pill {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    background: #f1f1f1;
    font-size: 11px;
  }

  @media (max-width: 900px) {
    .admin-page {
      padding: 24px 16px;
    }

    .admin-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .metrics {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }
</style>