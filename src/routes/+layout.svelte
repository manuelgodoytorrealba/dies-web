<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';

  let { data, children } = $props();
  // data.session viene del +layout.server.ts
  const session = $derived(data.session);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#if session}
  <header class="topbar">
    <a href="/logout" class="logout">Logout</a>
  </header>
{/if}

{@render children()}

<style>
  .topbar {
    display: flex;
    justify-content: flex-end;
    padding: 12px 20px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    border-bottom: 1px solid #eee;
  }
  .logout {
    font-weight: 600;
    text-decoration: none;
  }
</style>