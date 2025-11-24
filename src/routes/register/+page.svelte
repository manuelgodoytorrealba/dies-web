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

    if (!email || !password) {
      errorMsg = 'Completa email y contraseña.';
      return;
    }
    if (password !== confirmPassword) {
      errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    loading = true;

    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        // a dónde vuelve Supabase cuando confirma email
        emailRedirectTo: `${window.location.origin}/catalog`
      }
    });

    loading = false;

    if (error) {
      errorMsg = error.message;
      return;
    }

    successMsg =
      'Cuenta creada. Revisa tu correo y confirma para entrar.';
    
    // opcional: si quieres mandarlo directo a login
    // await goto('/login');
  }
</script>

<section class="auth">
  <h1>Crear cuenta</h1>

  <div class="card">
    <label>
      Email
      <input type="email" bind:value={email} placeholder="tu@email.com" />
    </label>

    <label>
      Contraseña
      <input type="password" bind:value={password} placeholder="••••••••" />
    </label>

    <label>
      Confirmar contraseña
      <input type="password" bind:value={confirmPassword} placeholder="••••••••" />
    </label>

    {#if errorMsg}
      <p class="error">{errorMsg}</p>
    {/if}
    {#if successMsg}
      <p class="success">{successMsg}</p>
    {/if}

    <button on:click={onRegister} disabled={loading}>
      {loading ? 'Creando...' : 'Crear cuenta'}
    </button>

    <div class="links">
      <a href="/login">Ya tengo cuenta</a>
    </div>
  </div>
</section>

<style>
  .auth { padding: 32px; display:flex; flex-direction:column; align-items:center; gap:16px; }
  .card { width: 320px; border:1px solid #ddd; border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:12px; background:#fff; }
  label { display:flex; flex-direction:column; gap:6px; font-weight:600; }
  input { padding:10px 12px; border-radius:10px; border:1px solid #444; }
  button { padding:10px 12px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-weight:700; cursor:pointer; }
  button:disabled { opacity:.6; cursor:default; }
  .error { color:#b00020; font-size:14px; }
  .success { color:#0a7a2f; font-size:14px; }
  .links { display:flex; justify-content:center; font-size:14px; margin-top:6px; }
</style>