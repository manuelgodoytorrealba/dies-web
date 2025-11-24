<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  export let data: {
    success?: boolean;
    error?: string;
  };

  let loading = false;
</script>

<section class="auth">
  <h1>Iniciar sesión</h1>

  <form
    method="POST"
    class="card"
    use:enhance={() => {
      loading = true;

      return async ({ result }) => {
        loading = false;

        if (result.type === 'success') {
          // si el action devolvió success, vamos al catálogo
          goto('/catalog');
        }
      };
    }}
  >
    <label>
      Email
      <input name="email" type="email" placeholder="tu@email.com" required />
    </label>

    <label>
      Contraseña
      <input name="password" type="password" placeholder="••••••••" required />
    </label>

    {#if data?.error}
      <p class="error">{data.error}</p>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? 'Entrando...' : 'Entrar'}
    </button>

    <div class="links">
      <a href="/register">Crear cuenta</a>
      <a href="/reset-password">Olvidé mi contraseña</a>
    </div>
  </form>
</section>

<style>
  .auth {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .card {
    width: 320px;
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fff;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
  }
  input {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #444;
  }
  button {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #444;
    background: #111;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
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
</style>