<script lang="ts">
  import { supabaseBrowser } from '$lib/supabase-browser';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let errorMsg = '';
  let successMsg = '';

  async function onRegister() {
    errorMsg = '';
    successMsg = '';
    loading = true;

    if (!email || !password || !confirmPassword) {
      errorMsg = 'Rellena todos los campos.';
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
      password
    });

    loading = false;

    // 1) Error “clásico” de Supabase
    if (error) {
      if (error.code === 'user_already_exists') {
        errorMsg = 'Ya existe una cuenta con este correo. Ve a Iniciar sesión.';
      } else {
        errorMsg = error.message;
      }
      return;
    }

    // 2) Caso “raro” de Supabase: no hay error pero el usuario ya existía
    const alreadyRegistered =
      data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

    if (alreadyRegistered) {
      errorMsg = 'Ya tienes una cuenta con este correo. Ve a Iniciar sesión.';
      return;
    }

    // 3) Registro correcto
    successMsg = `Cuenta creada. Revisa tu correo (${email}) y confirma para poder entrar.`;

    // Si quieres redirigir al login después de unos segundos:
    // setTimeout(() => goto('/login'), 2000);
  }
</script>

<section class="auth">
  <h1>Crear cuenta</h1>

  <div class="card">
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
  .auth { padding: 32px; display:flex; flex-direction:column; align-items:center; gap:16px; }
  .card { width: 320px; border:1px solid #ddd; border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:12px; background:#fff; }
  label { display:flex; flex-direction:column; gap:6px; font-weight:600;color: #111; }
  input { padding:10px 12px; border-radius:10px; border:1px solid #444; }
  button { padding:10px 12px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-weight:700; cursor:pointer; }
  button:disabled { opacity:.6; cursor:default; }
  .error { color:#b00020; font-size:14px; }
  .success { color:#0a7b28; font-size:14px; }
  .links { display:flex; justify-content:space-between; font-size:14px; }
</style>