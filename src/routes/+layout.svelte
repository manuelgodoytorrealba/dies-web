<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import CatalogHeader from '$lib/components/layout/CatalogHeader.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import '$lib/styles/base.css';
	import '$lib/styles/utilities.css';
	import '$lib/styles/components.css';

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

	/* contenedor central */

  main.app-shell {
    flex: 1;
    min-height: 0;
    width: 100%;
    /* ya NO centramos con justify-content/align-items */
    display: block;
  }
</style>
