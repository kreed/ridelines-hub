<script lang="ts">
import type { Snippet } from "svelte";
import Logo from "./logo.svelte";
import UserControls from "./user-controls.svelte";

let { children }: { children?: Snippet } = $props();
</script>

<header class="flex items-center justify-between px-3 py-3">
  <div class="flex items-center gap-3">
    <Logo />
    {#if children}
      {@render children()}
    {/if}
  </div>
  <UserControls />
</header>
