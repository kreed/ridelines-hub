<script lang="ts">
import { createMutation, createQuery } from "@tanstack/svelte-query";
import { onDestroy } from "svelte";
import { goto } from "$app/navigation";
import AuthRequired from "$lib/components/auth-required.svelte";
import SyncStatus from "$lib/components/sync-status.svelte";
import * as Alert from "$lib/components/ui/alert/index.js";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { trpc } from "$lib/utils/trpc";

let syncStarted = $state(false);
let pollInterval: ReturnType<typeof setInterval> | null = null;

// Check for existing sync status on load
const initialStatusQuery = createQuery(() => ({
  queryKey: ["syncStatus"],
  queryFn: () => trpc.sync.status.query(),
  staleTime: 0,
}));

// Enable polling if there's an active sync
$effect(() => {
  const status = initialStatusQuery.data;
  if (status && (status.status === "queued" || status.status === "in_progress")) {
    syncStarted = true;
  }
});

const syncStatusQuery = createQuery(() => ({
  queryKey: ["syncStatus"],
  queryFn: () => trpc.sync.status.query(),
  enabled: syncStarted,
  refetchInterval: 5000, // Poll every 5 seconds
}));

const syncMutation = createMutation(() => ({
  mutationFn: () => trpc.sync.trigger.mutate(),
  onSuccess: () => {
    syncStarted = true;
  },
}));

// Monitor sync status for completion
$effect(() => {
  const status = syncStatusQuery.data;
  if (status?.status === "completed") {
    // Redirect to map after sync completes
    setTimeout(() => {
      goto("/map");
    }, 2000);
  }
});

onDestroy(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
  }
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

            {#if !syncStarted}
              <Button
                onclick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                variant="default"
                size="lg"
                class="min-w-[200px]"
              >
                {#if syncMutation.isPending}
                  Starting sync...
                {:else}
                  Sync Activities
                {/if}
              </Button>
            {/if}

            {#if syncStarted}
              <div class="w-full max-w-2xl">
                <SyncStatus syncStatus={syncStarted && syncStatusQuery.data ? syncStatusQuery.data : initialStatusQuery.data || null} />
              </div>
            {/if}

            {#if syncMutation.isPending}
              <p class="text-sm text-muted-foreground">Starting sync process...</p>
            {/if}
          </div>
      </Card.Content>
    </Card.Root>
  </div>
</AuthRequired>

<svelte:head>
  <title>Ridelines - Onboarding</title>
</svelte:head>
