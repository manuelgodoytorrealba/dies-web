<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const user = data.user; // viene de +layout.server.ts

  const email = user?.email ?? '';
  const fullName = (user as any)?.user_metadata?.full_name ?? '';
</script>

<section class="profile-page">
 <div class="profile-card surface">
    <header class="profile-card__header">
      <h1 class="profile-title">Tu perfil</h1>
      <p class="profile-subtitle text-muted">
        Revisa tus datos básicos. Más adelante podrás editar y guardar tus preferencias.
      </p>
    </header>

    <div class="profile-card__body">
  <div class="profile-field">
    <label for="email">Email</label>
    <input class="email" id="email" type="email" value={email} readonly />
  </div>

  <div class="profile-field">
    <label for="fullName">Nombre para mostrar</label>
    <input
      id="fullName"
      type="text"
      value={fullName}
      placeholder="Tu nombre o alias"
    />
  </div>

  <div class="profile-field">
    <label for="whatsapp">WhatsApp (opcional)</label>
    <input
      id="whatsapp"
      type="tel"
      placeholder="+34 600 000 000"
    />
  </div>

  <div class="profile-field">
    <label for="bio">Bio corta</label>
    <textarea
      id="bio"
      rows="3"
      placeholder="Cuéntanos algo sobre ti o qué tipo de productos te interesan"
    ></textarea>
  </div>
</div>

    <footer class="profile-card__footer">
      <button class="btn" type="button" disabled>
        Guardar cambios (pronto)
      </button>
    </footer>
  </div>
</section>

<style>
  .profile-page {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: var(--space-6) var(--space-4);
  }
.email{
color: black !important;
}
  .profile-card {
    width: 100%;
    max-width: 520px;
    padding: var(--space-5) var(--space-5);
    box-shadow: var(--shadow-soft);
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
    color: var(--color-text-muted);
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

  .profile-card__footer .btn[disabled] {
    opacity: 0.5;
    cursor: default;
    transform: none;
    box-shadow: var(--shadow-soft);
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