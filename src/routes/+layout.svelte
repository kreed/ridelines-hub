<script lang="ts">
import "../app.css";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
import { ModeWatcher } from "mode-watcher";
import type { Snippet } from "svelte";
import { ClerkProvider } from "svelte-clerk";
import favicon from "$lib/assets/favicon.svg";
import SiteHeader from "$lib/components/site-header.svelte";
import { Toaster } from "$lib/components/ui/sonner";

const { children }: { children: Snippet } = $props();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000, // 5 seconds
    },
  },
});
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster closeButton={true} position="top-center" />
<ClerkProvider
  appearance={{
    theme: shadcn,
  }}
>
  <QueryClientProvider client={queryClient}>
    <div
      class="flex h-screen flex-col [--header-height:calc(--spacing(14))]"
    >
      <SiteHeader />
      <main class="flex-1 overflow-hidden">
        {@render children()}
      </main>
    </div>
  </QueryClientProvider>
</ClerkProvider>
