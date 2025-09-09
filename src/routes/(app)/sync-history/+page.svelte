<script lang="ts">
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Loader2, RefreshCw } from "@lucide/svelte";
import { createQuery } from "@tanstack/svelte-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AuthRequired from "$lib/components/auth-required.svelte";
import SyncStatus from "$lib/components/sync-status.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { trpc } from "$lib/utils/trpc";

dayjs.extend(relativeTime);

const syncHistoryQuery = createQuery(() => ({
  queryKey: ["syncHistory"],
  queryFn: () => trpc.sync.history.query({ limit: 20 }),
}));

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "failed":
      return AlertCircle;
    case "in_progress":
      return Loader2;
    case "queued":
      return Clock;
    default:
      return RefreshCw;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-green-600 dark:text-green-400";
    case "failed":
      return "text-red-600 dark:text-red-400";
    case "in_progress":
      return "text-blue-600 dark:text-blue-400";
    case "queued":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-muted-foreground";
  }
}

let expandedSync = $state<string | null>(null);

function toggleExpanded(syncId: string) {
  expandedSync = expandedSync === syncId ? null : syncId;
}
</script>

<AuthRequired>
  <div class="container mx-auto max-w-4xl p-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Sync History</h1>
      <Button href="/onboarding" variant="outline" size="sm">
        <RefreshCw class="mr-2 h-4 w-4" />
        New Sync
      </Button>
    </div>

    {#if syncHistoryQuery.isLoading}
      <div class="flex justify-center p-8">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    {:else if syncHistoryQuery.error}
      <Card.Root variant="glass" class="border-destructive">
        <Card.Content class="flex items-center gap-3 p-6">
          <AlertCircle class="h-5 w-5 text-destructive" />
          <p>Failed to load sync history: {syncHistoryQuery.error.message}</p>
        </Card.Content>
      </Card.Root>
    {:else if syncHistoryQuery.data && syncHistoryQuery.data.length > 0}
      <div class="space-y-4">
        {#each syncHistoryQuery.data as sync}
          {@const StatusIcon = getStatusIcon(sync.status)}
          <Card.Root variant="glass" class="transition-shadow hover:shadow-md">
            <Card.Header>
              <button
                onclick={() => toggleExpanded(sync.syncId)}
                class="flex w-full items-center justify-between text-left"
              >
                <div class="flex items-center gap-3">
                  <StatusIcon
                    class="h-5 w-5 {getStatusColor(sync.status)} {sync.status === 'in_progress' ? 'animate-spin' : ''}"
                  />
                  <div>
                    <h3 class="font-medium">
                      {sync.status === "queued" ? "Queued" :
                       sync.status === "in_progress" ? "In Progress" :
                       sync.status === "completed" ? "Completed" : "Failed"}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      {dayjs(sync.requestedAt).fromNow()}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  class="h-4 w-4 text-muted-foreground transition-transform {expandedSync === sync.syncId ? 'rotate-90' : ''}"
                />
              </button>
            </Card.Header>

            {#if expandedSync === sync.syncId}
              <Card.Content>
                <div class="space-y-4">
                  <div class="grid gap-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Requested:</span>
                      <span>{dayjs(sync.requestedAt).format("YYYY-MM-DD hh:mm:ss A")}</span>
                    </div>
                    {#if sync.status !== "queued" && sync.startedAt}
                      <div class="flex justify-between">
                        <span class="text-muted-foreground">Started:</span>
                        <span>{dayjs(sync.startedAt).format("YYYY-MM-DD hh:mm:ss A")}</span>
                      </div>
                    {/if}
                    {#if sync.status === "completed" && sync.completedAt}
                      <div class="flex justify-between">
                        <span class="text-muted-foreground">Completed:</span>
                        <span>{dayjs(sync.completedAt).format("YYYY-MM-DD hh:mm:ss A")}</span>
                      </div>
                    {/if}
                  </div>

                  <div class="pt-2">
                    <SyncStatus syncStatus={sync} />
                  </div>
                </div>
              </Card.Content>
            {/if}
          </Card.Root>
        {/each}
      </div>
    {:else}
      <Card.Root variant="glass">
        <Card.Content class="p-8 text-center">
          <p class="text-muted-foreground">No sync history found.</p>
          <Button href="/onboarding" variant="default" class="mt-4">
            Start Your First Sync
          </Button>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</AuthRequired>

<svelte:head>
  <title>Ridelines - Sync History</title>
</svelte:head>
