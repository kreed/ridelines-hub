<script lang="ts">
import { createMutation } from "@tanstack/svelte-query";
import { goto } from "$app/navigation";
import AuthRequired from "$lib/components/auth-required.svelte";
import * as Alert from "$lib/components/ui/alert/index.js";
import { Button } from "$lib/components/ui/button/index.js";
import * as Card from "$lib/components/ui/card/index.js";
import { trpc } from "$lib/utils/trpc";

const syncMutation = createMutation(() => ({
  mutationFn: () => trpc.sync.trigger.mutate(),
  onSuccess: () => {
    // Redirect to map after a short delay
    setTimeout(() => {
      goto("/map");
    }, 2000);
  },
}));
</script>

<AuthRequired>
  <div class="container mx-auto max-w-2xl p-6">
    <Card.Root>
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

            {#if syncMutation.isSuccess}
              <Alert.Root class="max-w-md border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <Alert.Title>Success!</Alert.Title>
                <Alert.Description>Sync initiated successfully! Redirecting to your map...</Alert.Description>
              </Alert.Root>
            {/if}

            <Button
              onclick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending || syncMutation.isSuccess}
              variant="default"
              size="lg"
              class="min-w-[200px]"
            >
              {#if syncMutation.isPending}
                Syncing...
              {:else if syncMutation.isSuccess}
                Sync Complete!
              {:else}
                Sync Activities
              {/if}
            </Button>

            {#if syncMutation.isPending}
              <p class="text-sm text-muted-foreground">This may take a few minutes depending on the number of activities.</p>
            {/if}
          </div>
      </Card.Content>
    </Card.Root>
  </div>
</AuthRequired>

<svelte:head>
  <title>Ridelines - Onboarding</title>
</svelte:head>
