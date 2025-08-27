import type { UserProfile } from "$lib/api";
import { type AuthResult, ridelinesService } from "$lib/services/ridelines.js";

interface AuthState {
	isAuthenticated: boolean;
	user: UserProfile | null;
	pmtilesUrl: string | null;
	isLoading: boolean;
	error: string | null;
}

// Svelte 5 runes-based store
class AuthStore {
	private state = $state<AuthState>({
		isAuthenticated: false,
		user: null,
		pmtilesUrl: null,
		isLoading: false,
		error: null,
	});

	// Reactive getters
	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	get user() {
		return this.state.user;
	}

	get pmtilesUrl() {
		return this.state.pmtilesUrl;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get error() {
		return this.state.error;
	}

	/**
	 * Initialize authentication state
	 */
	async init() {
		await this.checkAuth();
	}

	/**
	 * Check authentication status
	 */
	async checkAuth() {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			const result: AuthResult = await ridelinesService.checkAuthentication();

			this.state.isAuthenticated = result.isAuthenticated;
			this.state.user = result.user || null;
			this.state.pmtilesUrl = result.pmtilesUrl || null;
			this.state.error = result.error || null;
		} catch (error) {
			this.state.isAuthenticated = false;
			this.state.user = null;
			this.state.pmtilesUrl = null;
			this.state.error =
				error instanceof Error ? error.message : "Authentication check failed";
		} finally {
			this.state.isLoading = false;
		}
	}

	/**
	 * Initiate login flow
	 */
	login(redirectPath?: string) {
		const loginUrl = ridelinesService.getLoginUrl(redirectPath);
		window.location.href = loginUrl;
	}

	/**
	 * Logout user
	 */
	logout() {
		ridelinesService.logout();
		this.state.isAuthenticated = false;
		this.state.user = null;
		this.state.pmtilesUrl = null;
		this.state.error = null;
	}

	/**
	 * Refresh user data (including PMTiles URL)
	 */
	async refreshUser() {
		if (!this.state.isAuthenticated) return;

		try {
			const userData = await ridelinesService.getUser();
			if (userData) {
				this.state.user = userData.user;
				this.state.pmtilesUrl = userData.pmtiles_url;
			}
		} catch (error) {
			console.error("Failed to refresh user data:", error);
		}
	}
}

// Export singleton instance
export const authStore = new AuthStore();
