<script lang="ts">
  import { supabaseBrowser } from '$lib/supabase-browser';
  import heroImage from '$lib/assets/login-register.jpg';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let fullName = '';
  let whatsapp = '';

  let loading = false;
  let errorMsg = '';
  let successMsg = '';

  async function onRegister() {
    errorMsg = '';
    successMsg = '';
    loading = true;

    if (!email || !password || !confirmPassword || !fullName) {
      errorMsg = 'Rellena todos los campos obligatorios.';
      loading = false;
      return;
    }

    if (password !== confirmPassword) {
      errorMsg = 'Las contraseñas no coinciden.';
      loading = false;
      return;
    }

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login',
        data: {
          full_name: fullName,
          whatsapp
        }
      }
    });

    loading = false;

    if (error) {
      if (error.code === 'user_already_exists') {
        errorMsg = 'Ya existe una cuenta con este correo. Ve a Iniciar sesión.';
      } else {
        errorMsg = error.message;
      }
      return;
    }

    const alreadyRegistered =
      data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

    if (alreadyRegistered) {
      errorMsg = 'Ya tienes una cuenta con este correo. Ve a Iniciar sesión.';
      return;
    }

    successMsg = `Cuenta creada. Revisa tu correo (${email}) y confirma para poder entrar.`;
  }
</script>

<section class="auth-layout">
  <div class="auth-shell">
    <!-- IMAGEN IZQUIERDA -->
    <div class="auth-hero">
      <img src={heroImage} alt="Sneaker reseller" />
      <div class="auth-hero__label">
        <p class="auth-hero__kicker">Sneaker Reseller</p>
        <p class="auth-hero__since">Desde 2018</p>
      </div>
    </div>

    <!-- PANEL DERECHO: REGISTER -->
    <div class="auth-panel">
      <div class="auth-panel__header">
        <h1>Crear cuenta</h1>
        <p class="auth-panel__subtitle">
          Regístrate para guardar tus leads, productos favoritos y pedidos.
        </p>
      </div>

      <div class="auth-form">
        <label>
          Nombre completo
          <input type="text" bind:value={fullName} placeholder="Tu nombre o alias" />
        </label>

        <label>
          WhatsApp (opcional)
          <input type="tel" bind:value={whatsapp} placeholder="+34 600 000 000" />
        </label>

        <label>
          Email
          <input type="email" bind:value={email} />
        </label>

        <label>
          Contraseña
          <input type="password" bind:value={password} />
        </label>

        <label>
          Repite la contraseña
          <input type="password" bind:value={confirmPassword} />
        </label>

        {#if errorMsg}
          <p class="auth-message auth-message--error">{errorMsg}</p>
        {/if}

        {#if successMsg}
          <p class="auth-message auth-message--success">{successMsg}</p>
        {/if}

        <button
          class="auth-btn auth-btn--primary"
          on:click={onRegister}
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <div class="auth-links">
          <a href="/login">Ya tengo cuenta</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Reutilizamos EXACTAMENTE los mismos estilos del login */
  .auth-layout {
    min-height: calc(100vh - 80px);
    padding: 32px 16px 48px;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-shell {
    width: 100%;
    max-width: 100vw;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 32px;
    background: #f8f6f3;
    border-radius: 24px;
    padding: 24px;
    border: 1px solid #ddd4c9;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.09);
  }

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

  .auth-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .auth-message {
    font-size: 0.85rem;
  }

  .auth-message--error {
    color: #b00020;
  }

  .auth-message--success {
    color: #0a7b28;
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