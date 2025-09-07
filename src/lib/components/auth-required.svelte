<script lang="ts">
import type { Snippet } from "svelte";
import { SignedOut, SignIn } from "svelte-clerk";

let { children }: { children?: Snippet } = $props();
</script>

{#if children}
	{@render children()}
{/if}

<SignedOut>
	<div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] backdrop-blur-sm">
		<SignIn
			routing="hash"
			redirectUrl={window.location.href}
		/>
	</div>
</SignedOut>
