<script lang="ts">
	import { enhance } from '$app/forms';
	import heroImage from '$lib/assets/login-register.jpg';

	export let form: { email?: string; error?: string } | undefined;
</script>

<section class="auth-layout">
	<div class="auth-shell">
		<!-- LADO IZQUIERDO: IMAGEN (solo desktop) -->
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
					<input id="password" type="password" name="password" placeholder="••••••••" required />
				</label>

				{#if form?.error}
					<p class="auth-message auth-message--error">{form.error}</p>
				{/if}

				<button type="submit" class="auth-btn auth-btn--primary"> Entrar </button>

				<div class="auth-links">
					<a href="/register">Crear cuenta</a>
				</div>
			</form>
		</div>
	</div>
</section>

<style>
	/* --- LAYOUT GENERAL (DESKTOP) --- */
	.auth-layout {
		width: 100%;
		/* 🔑 que ocupe todo el hueco entre header y footer */
		min-height: calc(100vh - 80px); /* ajusta 80 si tu header mide otra cosa */
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-bg);
		padding: 24px 0;
	}

	/* Tarjeta */
	.auth-shell {
		width: 100%;
		max-width: 1120px;
		max-height: 600px;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 28px;
		background: #f8f6f3;
		border-radius: 24px;
		padding: 20px;
		border: 1px solid #ddd4c9;
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.09);
	}

	/* IMAGEN IZQUIERDA */
	.auth-hero {
		border-radius: 20px;
		overflow: hidden;
		position: relative;
		background: #111;
		height: 80%;
	}

	.auth-hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.auth-hero__label {
		position: absolute;
		left: 24px;
		bottom: 24px;
		padding: 6px 12px;
		background: rgba(0, 0, 0, 0.32);
		border-radius: 8px;
		color: #fff;
		backdrop-filter: blur(2px);
	}

	.auth-hero__kicker {
		font-size: 1.5rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgb(255, 255, 255);
	}

	.auth-hero__since {
		margin-top: 4px;
		font-size: 0.8rem;
		opacity: 0.85;
		color: white;
	}

	/* PANEL DERECHO */
	.auth-panel {
		border-radius: 20px;
		background: #c9c5bc;
		padding: 20px 22px 18px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		height: 80%;
	}

	.auth-panel__header h1 {
		font-size: 1.6rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: center;
		color: #111;
	}

	.auth-panel__subtitle {
		margin-top: 4px;
		text-align: center;
		font-size: 0.9rem;
		color: #333;
	}

	.auth-form {
		margin-top: 6px;
		display: flex;
		flex-direction: column;
		gap: 12px;
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
		padding: 8px 10px;
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
		margin-top: 2px;
	}

	.auth-links a {
		text-decoration: underline;
	}

	/* --- MOBILE / TABLET: sin imagen, sólo formulario --- */
	@media (max-width: 880px) {
		.auth-layout {
			min-height: auto;
			padding: 20px 30px 32px;
			align-items: flex-start;
		}

		.auth-shell {
			max-height: none;
			grid-template-columns: 1fr;
			padding: 20px;
			background: white;
			box-shadow: none;
			border: none;
		}

		.auth-hero {
			display: none; /* 👈 desaparece la foto */
		}

		.auth-panel {
			height: auto;
			border-radius: 0;
			max-width: 480px;
			margin: 0 auto;
			padding: 0 16px;
			background: transparent;
		}
	}
	@media (min-width: 1600px) {
		.auth-shell {
			max-width: 1320px; /* un poco más grande */
			max-height: 700px; /* algo más de altura para el register */
		}
	}
	@media (max-width: 600px) {
		.auth-panel__header h1 {
			font-size: 1.3rem;
		}
	}
</style>
