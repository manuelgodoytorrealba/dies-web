<script lang="ts">
  // Más adelante aquí podremos leer la sesión global si quieres
  // import { sessionStore } from '$lib/stores/sessions';
  // $: session = $sessionStore;
</script>

<header class="catalog-header">
  <div class="left">
    <h1 class="title">Dies</h1>
  </div>

  <nav class="right">
    <a class="link" href="/login">Login</a>
    <a class="link primary" href="/register">Register</a>
<!-- 
    {/**
     * Cuando arreglemos el layout global:
     *
     * {#if session}
     *   <a class="link" href="/logout">Logout</a>
     * {:else}
     *   <a class="link" href="/login">Login</a>
     *   <a class="link primary" href="/register">Register</a>
     * {/if}
     */} -->
  </nav>
</header>

<style>
  .catalog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 8px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 5;
    border-bottom: 1px solid #eee;
  }

  .title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .right {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .link {
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid #111;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    color: #111;
    background: transparent;
    transition: 0.15s;
  }

  .link:hover {
    background: #f5f5f5;
  }

  .primary {
    background: #111;
    color: white;
  }

  .primary:hover {
    opacity: 0.8;
  }
</style>