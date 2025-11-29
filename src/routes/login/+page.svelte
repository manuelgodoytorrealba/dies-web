<script lang="ts">
  import { enhance } from '$app/forms';
  export let form: { email?: string; error?: string } | undefined;
</script>

<section class="auth">
  <h1 class="title">Iniciar sesión</h1>

  <form method="POST" use:enhance class="card">
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
    padding: 48px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 8px;
  }

  .card {
    width: 100%;
    max-width: 420px; /* 🔥 MÁS ANCHO */
    border: 1px solid #ddd;
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    color: #111;
  }

  input {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #444;
    font-size: 15px;
  }

  .btn {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #444;
    background: #111;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    font-size: 15px;
    margin-top: 6px;
  }

  .error {
    color: #b00020;
    font-size: 14px;
  }

  .links {
    display: flex;
    justify-content: center;
    font-size: 14px;
    margin-top: 4px;
  }

  .links a {
    color: #333;
  }
</style>