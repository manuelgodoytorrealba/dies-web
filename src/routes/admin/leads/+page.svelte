<script lang="ts">
  import type { PageData as BasePageData } from './$types';

  // --- Tipos ---------------------------------------------------

  type LeadProduct = {
    nombre: string;
    marca: string;
    precio_publicado: number;
    slug?: string | null;
  };

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
    referer?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    // join con products:
    product?: LeadProduct | null;
  };

  type PageData = BasePageData & {
    leads: LeadRow[];
  };

  export let data: PageData;

  const leads: LeadRow[] = data.leads ?? [];
  const statusOptions = ['new', 'contacted', 'closed'];

  // métricas simples
  const totalLeads = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const closedCount = leads.filter((l) => l.status === 'closed').length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString();
  }
</script>

<section class="leads-page">
  <header class="leads-header">
    <div>
      <h1>📊 Leads</h1>
      <p>Clicks en WhatsApp y contactos generados desde el catálogo.</p>
    </div>

    <div class="metrics">
      <div class="metric">
        <span class="metric-label">Total leads</span>
        <span class="metric-value">{totalLeads}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Nuevos</span>
        <span class="metric-value">{newCount}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Contactados</span>
        <span class="metric-value">{contactedCount}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Cerrados</span>
        <span class="metric-value">{closedCount}</span>
      </div>
    </div>
  </header>

  {#if !leads.length}
    <p class="empty">Todavía no hay leads registrados.</p>
  {:else}
    <div class="table-wrapper">
      <table class="leads-table">
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
              <!-- Fecha -->
              <td class="col-date">
                {formatDate(lead.created_at)}
              </td>

              <!-- Producto -->
              <td class="col-product">
                {#if lead.product}
                  <div class="prod-main">
                    <strong>{lead.product.nombre}</strong>
                  </div>
                  <div class="prod-sub">
                    {lead.product.marca} · €{lead.product.precio_publicado}
                  </div>
                {:else if lead.product_name_snapshot}
                  <div class="prod-main">
                    <strong>{lead.product_name_snapshot}</strong>
                  </div>
                  {#if lead.product_price_snapshot !== null}
                    <div class="prod-sub">€{lead.product_price_snapshot}</div>
                  {/if}
                  <div class="prod-sub muted">(snapshot)</div>
                {:else}
                  <div class="prod-main">
                    <strong>ID: {lead.product_id.slice(0, 8)}…</strong>
                  </div>
                  <div class="prod-sub muted">(snapshot vacío)</div>
                {/if}
              </td>

              <!-- Talla -->
              <td class="col-size">{lead.size ?? '—'}</td>

              <!-- Canal -->
              <td class="col-channel">{lead.channel ?? '—'}</td>

              <!-- Estado -->
              <td class="col-status">
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

              <!-- Origen -->
              <td class="col-source">
                {#if lead.source_page}
                  <code>{lead.source_page}</code>
                {:else if lead.referer}
                  <code>{lead.referer}</code>
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
  .leads-page {
    padding: 32px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .leads-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 16px;
  }

  .leads-header h1 {
    font-size: 24px;
    margin: 0 0 4px;
  }

  .leads-header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }

  .metrics {
    display: flex;
    gap: 8px;
  }

  .metric {
    padding: 8px 12px;
    border-radius: 999px;
    background: #f5f5f5;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .metric-label {
    opacity: 0.7;
  }

  .metric-value {
    font-weight: 600;
  }

  .empty {
    margin-top: 32px;
    font-size: 14px;
    opacity: 0.7;
  }

  .table-wrapper {
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  }

  .leads-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .leads-table th,
  .leads-table td {
    padding: 10px 16px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
    text-align: left;
  }

  .leads-table thead {
    background: #fafafa;
  }

  .col-date {
    width: 180px;
    white-space: nowrap;
  }

  .col-product {
    min-width: 220px;
  }

  .prod-main {
    margin-bottom: 2px;
  }

  .prod-sub {
    font-size: 12px;
    opacity: 0.8;
  }

  .muted {
    opacity: 0.6;
  }

  .col-size {
    width: 60px;
  }

  .col-channel {
    width: 90px;
  }

  .col-status {
    width: 130px;
  }

  .col-source code {
    font-size: 11px;
  }

  select {
    font-size: 13px;
    padding: 4px 6px;
    border-radius: 999px;
    border: 1px solid #ddd;
    background: #fff;
  }

  @media (max-width: 900px) {
    .leads-page {
      padding: 16px;
    }

    .leads-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .metrics {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }
</style>