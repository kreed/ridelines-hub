import type {
	SyncResponse,
	SyncStatusResponse,
	UserProfile,
	UserProfileResponse,
} from "$lib/api";
import { getSyncStatus, getUserProfile, triggerSync } from "$lib/api";
import { createClient } from "$lib/api/client";
import { env } from "$lib/config/env.js";

// Create API client with proper configuration
const apiClient = createClient({
	baseUrl: env.API_URL,
	credentials: "include" as RequestCredentials,
	fetch: typeof window !== "undefined" ? fetch.bind(window) : fetch,
});

export interface AuthResult {
	isAuthenticated: boolean;
	user?: UserProfile;
	pmtilesUrl?: string;
	error?: string;
}

export interface RidelinesService {
	// Authentication
	checkAuthentication(): Promise<AuthResult>;
	getLoginUrl(redirectPath?: string): string;
	logout(): void;
	getUser(): Promise<UserProfileResponse | null>;

	// Sync operations (for future use)
	getSyncStatus(): Promise<SyncStatusResponse | null>;
	triggerSync(): Promise<SyncResponse | null>;
}

class RidelinesServiceImpl implements RidelinesService {
	private cachedAuthResult: AuthResult | null = null;
	private cacheExpiry: number = 0;

	/**
	 * Make API call with standard error handling
	 */
	private async makeApiCall<T>(
		apiCall: () => Promise<{ response?: Response; data?: T }>,
	): Promise<T | null> {
		try {
			const response = await apiCall();
			if (response.response?.ok && response.data) {
				return response.data;
			}
			return null;
		} catch (error) {
			console.error("API call failed:", error);
			return null;
		}
	}

	/**
	 * Check if user is authenticated by calling /user endpoint
	 * Caches result for 5 minutes to avoid excessive API calls
	 */
	async checkAuthentication(): Promise<AuthResult> {
		// Return cached result if still valid
		if (this.cachedAuthResult && Date.now() < this.cacheExpiry) {
			return this.cachedAuthResult;
		}

		const userData = await this.getUser();

		if (userData) {
			this.cachedAuthResult = {
				isAuthenticated: true,
				user: userData.user,
				pmtilesUrl: userData.pmtiles_url,
			};
		} else {
			this.cachedAuthResult = {
				isAuthenticated: false,
				error: "Authentication failed",
			};
		}

		// Cache for 5 minutes
		this.cacheExpiry = Date.now() + 5 * 60 * 1000;
		return this.cachedAuthResult;
	}

	/**
	 * Generate login URL for OAuth flow
	 */
	getLoginUrl(redirectPath = "/"): string {
		const params = new URLSearchParams();
		if (redirectPath && redirectPath !== "/") {
			params.set("redirect_path", redirectPath);
		}

		const queryString = params.toString();
		return `${env.API_URL}/auth/login${queryString ? `?${queryString}` : ""}`;
	}

	/**
	 * Clear cached authentication state (for logout)
	 */
	logout(): void {
		this.cachedAuthResult = null;
		this.cacheExpiry = 0;

		// Clear any local storage related to auth
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem("ridelines_auth_state");
		}
	}

	/**
	 * Get user profile and PMTiles URL
	 */
	async getUser(): Promise<UserProfileResponse | null> {
		return this.makeApiCall(() => getUserProfile({ client: apiClient }));
	}

	/**
	 * Get sync status for authenticated user
	 */
	async getSyncStatus(): Promise<SyncStatusResponse | null> {
		return this.makeApiCall(() => getSyncStatus({ client: apiClient }));
	}

	/**
	 * Trigger activity synchronization
	 */
	async triggerSync(): Promise<SyncResponse | null> {
		return this.makeApiCall(() => triggerSync({ client: apiClient }));
	}
}

// Singleton instance
export const ridelinesService: RidelinesService = new RidelinesServiceImpl();
