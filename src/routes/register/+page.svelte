<script lang="ts">
  import { supabaseBrowser } from '$lib/supabase-browser';

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

<section class="auth auth--wide">
  <h1>Crear cuenta</h1>

  <div class="card card--wide">
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
      <p class="error">{errorMsg}</p>
    {/if}

    {#if successMsg}
      <p class="success">{successMsg}</p>
    {/if}

    <button on:click={onRegister} disabled={loading}>
      {loading ? 'Creando cuenta...' : 'Crear cuenta'}
    </button>

    <div class="links">
      <a href="/login">Ya tengo cuenta</a>
    </div>
  </div>
</section>

<style>
  .auth {
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

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
    max-width: 480px;
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

  .success {
    color: #0a7b28;
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