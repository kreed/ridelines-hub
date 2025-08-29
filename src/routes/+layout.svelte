<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { ClerkProvider } from "svelte-clerk";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";
import favicon from "$lib/assets/favicon.svg";

const { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
	{@render children()}
</ClerkProvider>
