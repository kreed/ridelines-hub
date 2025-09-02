<script lang="ts">
import "../app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
import type { Snippet } from "svelte";
import { ClerkProvider } from "svelte-clerk";
import favicon from "$lib/assets/favicon.svg";

const { children }: { children: Snippet } = $props();
const queryClient = new QueryClient();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	<QueryClientProvider client={queryClient}>
		{@render children()}
	</QueryClientProvider>
</ClerkProvider>
