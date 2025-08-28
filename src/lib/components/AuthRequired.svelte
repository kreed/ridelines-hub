<script lang="ts">
import { onMount } from "svelte";
import { page } from "$app/stores";
import { authStore } from "$lib/stores/auth.svelte.js";

let {
	message = "You must be logged in to view this page.",
	redirectPath = $page.url.pathname + $page.url.search + $page.url.hash,
}: {
	message?: string;
	redirectPath?: string;
} = $props();

let showAuthError = $state(false);

onMount(async () => {
	await authStore.init();

	if (!authStore.isAuthenticated) {
		showAuthError = true;
	}
});

function handleLogin() {
	authStore.login(redirectPath);
}
</script>

{#if showAuthError}
	<div class="auth-required-overlay">
		<div class="auth-required-content">
			<h2>Authentication Required</h2>
			<p>{message}</p>
			<button class="login-button" onclick={handleLogin}>
				Login with intervals.icu
			</button>
		</div>
	</div>
{/if}

<style>
	.auth-required-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.auth-required-content {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		text-align: center;
		max-width: 400px;
		margin: 1rem;
	}

	.auth-required-content h2 {
		color: #333;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.auth-required-content p {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.login-button {
		background: #ff6b6b;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.login-button:hover {
		background: #ff5252;
		transform: translateY(-1px);
	}
</style>
