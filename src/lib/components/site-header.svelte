<script lang="ts">
import type { Snippet } from "svelte";
import Logo from "./logo.svelte";
import UserControls from "./user-controls.svelte";

let {
  children,
  variant = "default",
}: {
  children?: Snippet;
  variant?: "default" | "glass";
} = $props();
</script>

<header class="flex items-center justify-between px-3 py-3">
  <div class="flex items-center gap-3">
    <Logo {variant} />
    {#if children}
      {@render children()}
    {/if}
  </div>
  <UserControls {variant} />
</header>
