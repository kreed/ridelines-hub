<script lang="ts">
import { createMutation, createQuery } from "@tanstack/svelte-query";
import { onMount } from "svelte";
import { slide } from "svelte/transition";
import AuthRequired from "$lib/components/auth-required.svelte";
import SyncStatus from "$lib/components/sync-status.svelte";
import * as Alert from "$lib/components/ui/alert/index.js";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { trpc } from "$lib/utils/trpc";

// Check for existing sync status and poll if active
const syncStatusQuery = createQuery(() => ({
  queryKey: ["syncStatus"],
  queryFn: () => trpc.sync.status.query(),
  staleTime: 0,
  refetchInterval: (query) => {
    const status = query.state.data;
    if (status && (status.status === "queued" || status.status === "in_progress")) {
      return 5000; // Poll every 5 seconds for active syncs
    }
    return false; // No polling for completed/failed/null states
  },
}));

const syncMutation = createMutation(() => ({
  mutationFn: (options?: { onboarding?: boolean }) => trpc.sync.trigger.mutate(options || {}),
  onSuccess: (data) => {
    // Refetch to get the new sync status
    syncStatusQuery.refetch();
  },
}));

// Auto-trigger sync on mount with onboarding flag
onMount(() => {
  syncMutation.mutate({ onboarding: true });
});
</script>

<AuthRequired>
  <div class="container mx-auto max-w-2xl p-6">
    <Card.Root variant="glass">
      <Card.Header class="text-center">
        <Card.Title class="font-bold">Welcome to Ridelines!</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="mb-6 text-center">Let's sync your activities from intervals.icu to get started.</p>

          <div class="flex flex-col items-center gap-4">
            {#if syncMutation.isError}
              <Alert.Root variant="destructive" class="max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <Alert.Title>Sync failed</Alert.Title>
                <Alert.Description>{syncMutation.error?.message || 'Unknown error'}</Alert.Description>
              </Alert.Root>
            {/if}

            {#if syncStatusQuery.data}
              <div class="w-full max-w-2xl" transition:slide={{ duration: 300 }}>
                <SyncStatus syncStatus={syncStatusQuery.data} />
              </div>
            {/if}

            {#if syncStatusQuery.data?.status === "completed"}
              <Button
                href="/map"
                variant="default"
                size="lg"
                class="min-w-[200px]"
              >
                Go to Map
              </Button>
            {/if}

            {#if syncStatusQuery.data?.status === "failed"}
              <Button
                onclick={() => syncMutation.mutate({})}
                disabled={syncMutation.isPending}
                variant="default"
                size="lg"
                class="min-w-[200px]"
              >
                {#if syncMutation.isPending}
                  Starting sync...
                {:else}
                  Retry Sync
                {/if}
              </Button>
            {/if}

          </div>
      </Card.Content>
    </Card.Root>
  </div>
</AuthRequired>

<svelte:head>
  <title>Ridelines - Onboarding</title>
</svelte:head>
