<script lang="ts">
  import type { User } from '@supabase/supabase-js';
  export let user: User | null = null;
  import logo from '$lib/assets/logo.svg';

  // De momento admin solo tú por email
  $: isAdmin = !!user && user.email === 'manuelgodoyvzla@gmail.com';
</script>

<header class="app-header">
  <div class="app-header__inner">
    <!-- Logo izquierda -->
    <div class="app-header__logo">
      <a href="/catalog" class="logo-link">
        <img src={logo} alt="logo-dies" />
      </a>
    </div>

    <!-- Título centrado absoluto (no se mueve nunca) -->
    <div class="app-header__brand">
      <a href="/catalog" class="app-header__title">DIES</a>
    </div>

    <!-- Nav derecha -->
    <nav class="app-header__nav">
      {#if user}
        {#if isAdmin}
          <a href="/admin" class="btn">Admin</a>
        {:else}
          <a href="/profile" class="btn">Mi perfil</a>
        {/if}

        <form method="POST" action="/logout">
          <button type="submit" class="btn">Logout</button>
        </form>
      {:else}
        <a class="btn" href="/login">Login</a>
        <a class="btn" href="/register">Register</a>
      {/if}
    </nav>
  </div>
</header>

<style>
  .app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid var(--color-border-subtle);
    background-color: var(--color-bg);
  }

  /* Flex para logo + nav, pero el título va absoluto */
  .app-header__inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    gap: var(--space-4);
  }

  .app-header__logo img {
    width: 4.5rem;
    height: 3.5rem;
    border-radius: var(--radius-lg);
    object-fit: contain;
    display: block;
  }

  .logo-link {
    display: inline-block;
    cursor: pointer;
  }

  /* 🔥 Título SIEMPRE en el centro del viewport */
  .app-header__brand {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: block;
  }

  .app-header__title {
    font-size: var(--text-2xl);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgb(251, 248, 248);
    text-decoration: none;
    white-space: nowrap;
  }

  .app-header__nav {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  /* 📱 Mobile */
@media (max-width: 768px) {
  /* Ocultar el título centrado en pantallas pequeñas */
  .app-header__brand {
    display: none;
  }

  .app-header__inner {
    padding: var(--space-2) var(--space-3);
    gap: var(--space-2);
  }

  .app-header__nav .btn {
    padding-inline: 0.75rem;
    font-size: var(--text-xs);
  }
}
</style>