import type { RootRouter } from "@kreed/ridelines-chainring";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<RootRouter>;

// Calculate SHA256 hash for request body
async function calculateBodyHash(body: string | undefined): Promise<string> {
  if (!body) {
    return "UNSIGNED-PAYLOAD";
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(body);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Singleton tRPC client. Cloudfront will extract the session cookie
// and use it as the Authorization header passed to Chainring, so there
// is no need to attach the header here.
export const trpc = createTRPCClient<RootRouter>({
  links: [
    httpBatchLink({
      url: `/trpc`,
      fetch: async (url, options) => {
        // Calculate hash of the actual request body
        const body = options?.body as string | undefined;
        const contentHash = await calculateBodyHash(body);

        // Add the header to the request
        const headers = new Headers(options?.headers || {});
        headers.set("x-amz-content-sha256", contentHash);

        return fetch(url, {
          ...options,
          headers,
        });
      },
    }),
  ],
});
