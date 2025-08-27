import { get } from "svelte/store";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { authStore } from "$lib/stores/auth.svelte.js";

/**
 * Client-side route protection for static sites
 * Call this in protected routes to ensure user is authenticated
 */
export async function requireAuth(): Promise<boolean> {
	// Initialize auth store and wait for completion
	await authStore.init();

	if (!authStore.isAuthenticated) {
		// Get current page for redirect after login
		const currentPage = get(page);
		const redirectPath = currentPage.url.pathname + currentPage.url.search;

		// Redirect to home page, which will show login
		await goto(`/?redirect=${encodeURIComponent(redirectPath)}`);
		return false;
	}

	return true;
}

/**
 * Hook for SvelteKit beforeNavigate to protect routes
 * Usage in protected routes:
 * ```ts
 * beforeNavigate(protectRoute);
 * ```
 */
export function protectRoute(navigation: { cancel: () => void }) {
	// Only protect navigation to the current page if not authenticated
	if (!authStore.isAuthenticated) {
		navigation.cancel();
		requireAuth();
	}
}
