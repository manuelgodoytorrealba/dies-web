<script lang="ts">
  import { enhance } from '$app/forms';

  export let form: { email?: string; error?: string } | undefined;
</script>

<section class="auth auth--wide">
  <h1>Iniciar sesión</h1>

  <form method="POST" use:enhance class="card card--wide">
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
      <p class="error">{form.error}</p>
    {/if}

    <button type="submit" class="btn">Entrar</button>

    <div class="links">
      <a href="/register">Crear cuenta</a>
    </div>
  </form>
</section>

<style>
  .auth {
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  /* ancho grande y centrado, alineado con DS */
  .auth--wide {
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    border: 1px solid #ddd;
    border-radius: 16px;
    padding: 24px 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: #fff;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  }

  .card--wide {
    width: 100%;
    max-width: 480px; /* antes 320px */
  }



  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    color: #111;
    font-size: 14px;
  }

  input {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #444;
    font-size: 14px;
  }

  .btn,
  button {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #444;
    background: #111;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }

  .error {
    color: #b00020;
    font-size: 14px;
  }

  .links {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    .card--wide {
      max-width: 100%;
    }
  }
</style>