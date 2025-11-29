<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	export let user: User | null = null;
	import logo from '$lib/assets/logo.svg';
</script>

<header class="app-header">
	<div class="app-header__inner flex-between">
		<div class="app-header__brand">
			<a href="/profile" class="app-header__title">DIES</a>
		</div>

		<div class="app-header__logo">
			<a href="/catalog" class="logo-link">
				<img src={logo} alt="logo-dies" />
			</a>
		</div>

		<nav class="app-header__nav">
			{#if user}
				<form method="POST" action="/logout">
					<button type="submit" class="btn">Logout</button>
				</form>
			{:else}
				<a class="btn" href="/login">Login</a>
				<a class="btn" href="/register">Register</a>
			{/if}
		</nav>
	</div>
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid var(--color-border-subtle);
		background-color: var(--color-bg);
	}

	.app-header__inner {
		padding: var(--space-3) var(--space-4);
		gap: var(--space-4);
		align-items: center;
	}

	.app-header__title {
		font-size: var(--text-2xl);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: black;
	}

	.app-header__logo img {
		
		width: 4.5rem;
		height: 3.5rem;
		border-radius: var(--radius-lg);
		object-fit: contain;
	}

	.app-header__nav {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

  .logo-link {
  display: inline-block;
  cursor: pointer;
}

.logo-link img {
  display: block;
}

	@media (max-width: 768px) {
		.app-header__inner {
			gap: var(--space-3);
		}

		.app-header__logo {
			display: none;
		}
	}
</style>
