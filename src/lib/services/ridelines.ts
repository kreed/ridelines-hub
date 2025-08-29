import { useClerkContext } from "svelte-clerk";
import type {
	SyncResponse,
	SyncStatusResponse,
	UserProfile,
	UserProfileResponse,
} from "$lib/api";
import { getSyncStatus, getUserProfile, triggerSync } from "$lib/api";
import { createClient } from "$lib/api/client";
import { config } from "$lib/stores/config.js";

export interface AuthResult {
	isAuthenticated: boolean;
	user?: UserProfile;
	pmtilesUrl?: string;
	error?: string;
}

export interface RidelinesService {
	// Authentication
	checkAuthentication(): Promise<AuthResult>;
	getUser(): Promise<UserProfileResponse | null>;

	// Sync operations (for future use)
	getSyncStatus(): Promise<SyncStatusResponse | null>;
	triggerSync(): Promise<SyncResponse | null>;
}

class RidelinesServiceImpl implements RidelinesService {
	private cachedAuthResult: AuthResult | null = null;
	private cacheExpiry: number = 0;

	/**
	 * Get authenticated API client with Clerk token
	 */
	private async getAuthenticatedClient() {
		const { session } = useClerkContext();
		const token = await session?.getToken();

		return createClient({
			baseUrl: config.apiUrl,
			headers: token
				? {
						Authorization: `Bearer ${token}`,
					}
				: undefined,
			fetch: typeof window !== "undefined" ? fetch.bind(window) : fetch,
		});
	}

	/**
	 * Make API call with standard error handling
	 */
	private async makeApiCall<T>(
		apiCall: (
			client: ReturnType<typeof createClient>,
		) => Promise<{ response?: Response; data?: T }>,
	): Promise<T | null> {
		try {
			const client = await this.getAuthenticatedClient();
			const response = await apiCall(client);
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
	 * Get user profile and PMTiles URL
	 */
	async getUser(): Promise<UserProfileResponse | null> {
		return this.makeApiCall((client) => getUserProfile({ client }));
	}

	/**
	 * Get sync status for authenticated user
	 */
	async getSyncStatus(): Promise<SyncStatusResponse | null> {
		return this.makeApiCall((client) => getSyncStatus({ client }));
	}

	/**
	 * Trigger activity synchronization
	 */
	async triggerSync(): Promise<SyncResponse | null> {
		return this.makeApiCall((client) => triggerSync({ client }));
	}
}

// Singleton instance
export const ridelinesService: RidelinesService = new RidelinesServiceImpl();
