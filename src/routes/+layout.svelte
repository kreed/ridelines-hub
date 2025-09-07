<script lang="ts">
import "../app.css";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
import { ModeWatcher } from "mode-watcher";
import type { Snippet } from "svelte";
import { ClerkProvider } from "svelte-clerk";
import { page } from "$app/stores";
import favicon from "$lib/assets/favicon.svg";
import CloudWatchRUM from "$lib/components/cloudwatch-rum.svelte";
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

const isMapPage = $derived($page.url.pathname === "/map");
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster closeButton={true} position="top-center" />
<CloudWatchRUM />
<ClerkProvider
  appearance={{
    theme: shadcn,
  }}
>
  <QueryClientProvider client={queryClient}>
    <div class="flex flex-col h-screen">
      {#if !isMapPage}
        <SiteHeader />
      {/if}
      <main class="flex-1 overflow-hidden">
        {@render children()}
      </main>
    </div>
  </QueryClientProvider>
</ClerkProvider>
