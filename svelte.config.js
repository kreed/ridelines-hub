import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Configure static adapter for AWS S3/CloudFront deployment
		adapter: adapter({
			// Output directory for static files
			pages: 'build',
			// Assets directory within pages
			assets: 'build',
			// Fallback for SPA routing (CloudFront will redirect 404s to this)
			fallback: 'index.html',
			// Precompress files for better performance
			precompress: false,
			// Don't include trailing slashes in prerendered pages
			strict: true
		}),
		// Prerender all routes by default for better SEO
		prerender: {
			entries: ['*'],
			handleMissingId: 'warn'
		},
		// Configure paths for CloudFront deployment
		paths: {
			// Will be configured via environment variables for different environments
			base: process.env.NODE_ENV === 'production' ? '' : ''
		}
	}
};

export default config;
