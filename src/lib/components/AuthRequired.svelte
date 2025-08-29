<script lang="ts">
import { SignedOut, SignIn } from "svelte-clerk";

let { children } = $props();
</script>

{@render children?.()}

<SignedOut>
	<div class="auth-overlay">
		<SignIn
			routing="hash"
			redirectUrl={window.location.href}
		/>
	</div>
</SignedOut>

<style>
	.auth-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		backdrop-filter: blur(4px);
	}
</style>
