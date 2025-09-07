<script lang="ts">
import { goto } from "$app/navigation";
</script>

<button
  onclick={() => goto('/')}
  class="flex h-10 items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
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
