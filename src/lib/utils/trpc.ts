import type { RootRouter } from "@kreed/ridelines-chainring";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useClerkContext } from "svelte-clerk";

// Create basic tRPC client
export const trpc = createTRPCClient<RootRouter>({
	links: [
		httpBatchLink({
			url: `/trpc`,
			async headers() {
				const { session } = useClerkContext();
				const token = await session?.getToken();

				return token
					? {
							Authorization: `Bearer ${token}`,
						}
					: {};
			},
		}),
	],
});
