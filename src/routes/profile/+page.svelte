<script lang="ts">
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData | undefined;

  const user = data.user;
  const email = user?.email ?? '';

  let fullName =
    (form?.values?.full_name as string | undefined) ??
    data.profile.full_name ??
    '';

  let whatsapp =
    (form?.values?.whatsapp as string | undefined) ??
    data.profile.whatsapp ??
    '';

  let bio =
    (form?.values?.bio as string | undefined) ??
    data.profile.bio ??
    '';
</script>

<section class="profile-page">
  <form method="POST" action="?/update" class="profile-card surface">
    <header class="profile-card__header">
      <h1 class="profile-title">Tu perfil</h1>
      <p class="profile-subtitle text-muted">
        Revisa y guarda tus datos básicos. Los usaremos para contactos y futuras funcionalidades.
      </p>
    </header>

    <div class="profile-card__body">
      <div class="profile-field">
        <label for="email">Email</label>
        <input
          class="email"
          id="email"
          type="email"
          value={email}
          readonly
        />
      </div>

      <div class="profile-field">
        <label for="fullName">Nombre para mostrar</label>
        <input
          id="fullName"
          name="full_name"
          type="text"
          bind:value={fullName}
          placeholder="Tu nombre o alias"
        />
      </div>

      <div class="profile-field">
        <label for="whatsapp">WhatsApp (opcional)</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          bind:value={whatsapp}
          placeholder="+34 600 000 000"
        />
      </div>

      <div class="profile-field">
        <label for="bio">Bio corta</label>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          bind:value={bio}
          placeholder="Cuéntanos algo sobre ti o qué tipo de productos te interesan"
        ></textarea>
      </div>

      {#if form?.error}
        <p class="profile-error">{form.error}</p>
      {/if}

      {#if form?.success}
        <p class="profile-success">Cambios guardados correctamente.</p>
      {/if}
    </div>

    <footer class="profile-card__footer">
      <button class="btn" type="submit">
        Guardar cambios
      </button>
    </footer>
  </form>
</section>

<style>
  .profile-page {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: var(--space-6) var(--space-4);
  }

  .email {
    color: black !important;
  }

  .profile-card {
    width: 100%;
    max-width: 520px;
    padding: var(--space-5) var(--space-5);
    box-shadow: var(--shadow-soft);
    background: var(--color-surface, #ffffff);
    border-radius: var(--radius-lg, 18px);
  }

  .profile-card__header {
    margin-bottom: var(--space-4);
  }

  .profile-title {
    font-size: var(--text-xl);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: var(--space-2);
  }

  .profile-subtitle {
    font-size: var(--text-sm);
    color: #111;
  }

  .profile-card__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    
  }

  .profile-field label {
    display: block;
    margin-bottom: var(--space-1);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted);
  }

  .profile-field input,
  .profile-field textarea {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-subtle);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    resize: vertical;
    box-shadow: var(--shadow-soft);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast),
      background-color var(--transition-fast),
      transform var(--transition-fast);
  }

  .profile-field input:focus,
  .profile-field textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-medium);
    transform: translateY(-1px);
  }

  .profile-card__footer {
    display: flex;
    justify-content: flex-end;
  }

  .btn {
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid #111;
    background: #111;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  .profile-error {
    color: #b00020;
    font-size: 14px;
  }

  .profile-success {
    color: #0a7b28;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .profile-page {
      padding: var(--space-4) var(--space-3);
    }

    .profile-card {
      padding: var(--space-4) var(--space-3);
    }
  }
</style>