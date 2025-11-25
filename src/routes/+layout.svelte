<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import CatalogHeader from '$lib/components/layout/CatalogHeader.svelte';

  let { data, children } = $props();

  // user viene de +layout.server.ts
  const user = $derived(data.user ?? null);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<CatalogHeader {user} />

{@render children()}