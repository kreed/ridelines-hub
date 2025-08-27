// Environment configuration with fallbacks
export const env = {
	// API configuration
	API_URL:
		import.meta.env.VITE_API_URL ||
		(import.meta.env.DEV ? "/api" : `https://api.${window.location.hostname}`),

	// MapTiler API key - must be provided via environment variable
	MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY,
} as const;

// Type-safe environment validation
if (!env.API_URL) {
	throw new Error("VITE_API_URL environment variable is required");
}

if (!env.MAPTILER_API_KEY) {
	throw new Error("VITE_MAPTILER_API_KEY environment variable is required");
}

export type Environment = typeof env;
