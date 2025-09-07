<script lang="ts">
import type { Snippet } from "svelte";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

let {
  children,
}: {
  children: Snippet;
} = $props();
</script>

<DropdownMenu.Trigger class="inline-flex h-10 min-w-[140px] sm:w-48 items-center justify-between rounded-md border px-2 sm:px-3 py-2 text-sm backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-black/10 bg-white/60 text-black hover:bg-white/70 focus-visible:ring-black/20 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30 dark:focus-visible:ring-white/50">
  {@render children()}
</DropdownMenu.Trigger>
