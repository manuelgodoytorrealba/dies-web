<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import CatalogHeader from '$lib/components/layout/CatalogHeader.svelte';

  const { data, children } = $props();
</script>

<CatalogHeader session={data.session} />

{@render children()}