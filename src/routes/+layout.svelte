<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import CatalogHeader from '$lib/components/layout/CatalogHeader.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';

  import '$lib/styles/base.css';
  import '$lib/styles/utilities.css';
  import '$lib/styles/components.css';
  // tokens normalmente ya los importa base.css; si quieres puedes quitar esta línea
  // import '$lib/styles/tokens.css';

  let { data, children } = $props();
  const user = $derived(data.user ?? null);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="page-root">
  <CatalogHeader {user} />

  <main class="app-shell">
    {@render children()}
  </main>

  <Footer />
</div>

<style>
  .page-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-shell {
    flex: 1; /* ocupa todo el espacio entre header y footer */
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }
</style>