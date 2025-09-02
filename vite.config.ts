// @ts-nocheck
import type { IncomingMessage } from "node:http";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
// / <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.dev.ridelines.xyz",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes: IncomingMessage, req: IncomingMessage) => {
            const devServerUrl = `http://${req.headers.host}`;

            // Transform OAuth redirects to use dev server
            if (proxyRes.headers.location) {
              const location = proxyRes.headers.location;
              const localCallback = encodeURIComponent(`${devServerUrl}/api/auth/callback`);
              const originalCallback = encodeURIComponent("https://api.dev.ridelines.xyz/auth/callback");

              const transformedLocation = location
                .replace(`redirect_uri=${originalCallback}`, `redirect_uri=${localCallback}`)
                .replace(/https:\/\/[^.]*\.ridelines\.xyz/g, devServerUrl);

              if (transformedLocation !== location) {
                proxyRes.headers.location = transformedLocation;
              }
            }

            // Transform Set-Cookie domain for localhost
            if (proxyRes.headers["set-cookie"]) {
              proxyRes.headers["set-cookie"] = proxyRes.headers["set-cookie"].map((cookie: string) =>
                cookie.replace(/Domain=[^;]+/gi, "Domain=localhost"),
              );
            }
          });
        },
      },
    },
  },
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          environment: "browser",
          browser: {
            enabled: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./vitest-setup-client.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
    ],
  },
});
