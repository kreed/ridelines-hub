<script lang="ts">
import { goto } from "$app/navigation";

let {
  variant = "default",
}: {
  variant?: "default" | "glass";
} = $props();
</script>

<button
  onclick={() => goto('/')}
  class={variant === "glass" ? "flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold backdrop-blur-md transition-colors border-black/10 bg-white/60 text-black hover:bg-white/70 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30" : "flex h-10 items-center gap-2 rounded-md border border-transparent bg-transparent px-3 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground"}
  aria-label="Go to homepage"
>
  <!-- Logo SVG - abstract mountain/terrain lines -->
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    class="w-6 h-6"
    aria-hidden="true"
  >
    <path
      d="M3 18L6 14L9 16L13 10L16 13L21 6"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 20L8 15L12 17L15 14L21 9"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.5"
    />
  </svg>
  <span>ridelines</span>
</button>
