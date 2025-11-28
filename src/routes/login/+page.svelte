<script lang="ts">
	import { enhance } from '$app/forms';

	// El form puede ser undefined y puede incluir email y/o error
	export let form: { email?: string; error?: string } | undefined;
</script>

<section class="auth">
	<h1>Iniciar sesión</h1>

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
		color: #111;
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