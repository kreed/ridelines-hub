import type { RootRouter } from "@kreed/ridelines-chainring";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * Create a tRPC client without touching Svelte context.
 * Pass a `getToken` function from inside a component (e.g., via Clerk context).
 */
export function createClient(getToken?: () => Promise<string | null | undefined>) {
  return createTRPCClient<RootRouter>({
    links: [
      httpBatchLink({
        url: `/trpc`,
        async headers() {
          const token = (await getToken?.()) ?? null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
