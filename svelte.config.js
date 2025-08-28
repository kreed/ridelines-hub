import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Configure static adapter for AWS S3/CloudFront deployment
		adapter: adapter({
			// Output directory for static files
			pages: "build",
			// Assets directory within pages
			assets: "build",
		}),
	},
};

export default config;
