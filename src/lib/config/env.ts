// Environment configuration with fallbacks

import { browser } from "$app/environment";

export const env = {
	// API configuration - use getter for lazy evaluation
	get API_URL() {
		return (
			import.meta.env.VITE_API_URL ||
			(import.meta.env.DEV
				? "/api"
				: `https://api.${browser ? window.location.hostname : "localhost"}`)
		);
	},

	// MapTiler API key - must be provided via environment variable
	MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY,
} as const;

// Type-safe environment validation (only check MAPTILER_API_KEY at module load)
// API_URL validation happens at runtime when accessed

if (!env.MAPTILER_API_KEY) {
	throw new Error("VITE_MAPTILER_API_KEY environment variable is required");
}

export type Environment = typeof env;
