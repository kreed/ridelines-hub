<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { ClerkProvider } from "svelte-clerk";
import favicon from "$lib/assets/favicon.svg";

const { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	{@render children()}
</ClerkProvider>
