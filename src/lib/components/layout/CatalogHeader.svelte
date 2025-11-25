<script lang="ts">
  import type { User } from '@supabase/supabase-js';

  // user viene de +layout.server.ts
  export let user: User | null = null;
</script>

<header class="catalog-header">
  <h1 class="title">DIES</h1>

  <nav>
    {#if user}
      <form method="POST" action="/logout">
        <button type="submit" class="link">Logout</button>
      </form>
    {:else}
      <a class="link" href="/login">Login</a>
      <a class="link primary" href="/register">Register</a>
    {/if}
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

  nav {
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