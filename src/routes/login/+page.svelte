<script lang="ts">
  import { enhance } from '$app/forms';
  import heroImage from '$lib/assets/login-register.jpg';

  export let form: { email?: string; error?: string } | undefined;
</script>

<section class="auth-layout">
  <div class="auth-shell">
    <!-- LADO IZQUIERDO: IMAGEN -->
    <div class="auth-hero">
      <img src={heroImage} alt="Sneaker reseller" />

      <div class="auth-hero__label">
        <p class="auth-hero__kicker">Sneaker Reseller</p>
        <p class="auth-hero__since">Desde 2018</p>
      </div>
    </div>

    <!-- LADO DERECHO: PANEL LOGIN -->
    <div class="auth-panel">
      <div class="auth-panel__header">
        <h1>Iniciar sesión</h1>
        <p class="auth-panel__subtitle">
          Accede a tu cuenta para gestionar productos, leads y pedidos.
        </p>
      </div>

      <form method="POST" use:enhance class="auth-form">
        <label for="email">
          Email
          <input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={form?.email ?? ''}
            required
          />
        </label>

        <label for="password">
          Contraseña
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </label>

        {#if form?.error}
          <p class="auth-message auth-message--error">{form.error}</p>
        {/if}

        <button type="submit" class="auth-btn auth-btn--primary">
          Entrar
        </button>

        <div class="auth-links">
          <a href="/register">Crear cuenta</a>
        </div>
      </form>
    </div>
  </div>
</section>

<style>
  /* LAYOUT GENERAL */
  .auth-layout {
    min-height: calc(100vh - 80px); /* resto del header */
    padding: 32px 16px 48px;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-shell {
    width: 100%;
    max-width: 1120px;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 32px;
    background: #f8f6f3;
    border-radius: 24px;
    padding: 24px;
    border: 1px solid #ddd4c9;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.09);
  }

  /* IMAGEN IZQUIERDA */
  .auth-hero {
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    background: #111;
  }

  .auth-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .auth-hero__label {
    position: absolute;
    left: 24px;
    bottom: 24px;
    color: white;
    font-family: var(--font-mono, 'SF Mono', ui-monospace, Menlo, monospace);
  }

  .auth-hero__kicker {
    font-size: 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .auth-hero__since {
    margin-top: 4px;
    font-size: 0.8rem;
    opacity: 0.85;
  }

  /* PANEL DERECHO */
  .auth-panel {
    border-radius: 20px;
    background: #c9c5bc;
    padding: 28px 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .auth-panel__header h1 {
    font-size: 1.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-align: center;
    color: #111;
  }

  .auth-panel__subtitle {
    margin-top: 6px;
    text-align: center;
    font-size: 0.9rem;
    color: #333;
  }

  .auth-form {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    color: #222;
    font-size: 0.9rem;
  }

  input {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #444;
    font-size: 0.9rem;
    background: #fff;
  }

  .auth-btn {
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid #111;
    font-weight: 700;
    cursor: pointer;
    font-size: 0.95rem;
  }

  .auth-btn--primary {
    background: #111;
    color: #fff;
  }

  .auth-message {
    font-size: 0.85rem;
  }

  .auth-message--error {
    color: #b00020;
  }

  .auth-links {
    display: flex;
    justify-content: flex-start;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  .auth-links a {
    text-decoration: underline;
  }

  /* 📱 MOBILE */
  @media (max-width: 880px) {
    .auth-shell {
      grid-template-columns: 1fr;
      padding: 18px;
      gap: 18px;
    }

    .auth-hero {
      height: 260px;
    }

    .auth-panel {
      padding: 20px 18px 18px;
    }

    .auth-panel__header h1 {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 600px) {
    .auth-layout {
      padding: 16px 8px 32px;
    }

    .auth-hero {
      height: 220px;
      border-radius: 16px;
    }

    .auth-panel {
      border-radius: 16px;
    }
  }
</style>