<script lang="ts">
import SiteHeader from "$lib/components/site-header.svelte";
</script>

<!-- Full page gradient background -->
<div class="fixed inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-[#4c3a8a] dark:to-[#3d2951] -z-10"></div>

<div class="flex flex-col min-h-screen text-white">
  <SiteHeader />
  <slot />
</div>
