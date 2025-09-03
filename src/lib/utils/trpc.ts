import type { RootRouter } from "@kreed/ridelines-chainring";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Singleton tRPC client. Cloudfront will extract the session cookie
// and use it as the Authorization header passed to Chainring, so there
// is no need to attach the header here.
export const trpc = createTRPCClient<RootRouter>({
  links: [httpBatchLink({ url: `/trpc` })],
});
