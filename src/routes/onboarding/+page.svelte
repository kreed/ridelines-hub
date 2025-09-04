<script lang="ts">
import { createMutation } from "@tanstack/svelte-query";
import { goto } from "$app/navigation";
import AuthRequired from "$lib/components/AuthRequired.svelte";
import type { Config } from "$lib/types";
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
  <div class="onboarding-container">
    <h1>Welcome to Ridelines!</h1>

    <div class="content">
    <p>Let's sync your activities from intervals.icu to get started.</p>

    <div class="sync-section">
      {#if syncMutation.isError}
        <div class="error-message">
          <p>Sync failed: {syncMutation.error?.message || 'Unknown error'}</p>
        </div>
      {/if}

      {#if syncMutation.isSuccess}
        <div class="success-message">
          <p>✓ Sync initiated successfully! Redirecting to your map...</p>
        </div>
      {/if}

      <button
        on:click={() => syncMutation.mutate()}
        disabled={syncMutation.isPending || syncMutation.isSuccess}
        class="sync-button"
        class:syncing={syncMutation.isPending}
      >
        {#if syncMutation.isPending}
          Syncing...
        {:else if syncMutation.isSuccess}
          Sync Complete!
        {:else}
          Sync Activities
        {/if}
      </button>

      {#if syncMutation.isPending}
        <p class="sync-note">This may take a few minutes depending on the number of activities.</p>
      {/if}
    </div>
  </div>
</div>
</AuthRequired>

<svelte:head>
  <title>Ridelines - Onboarding</title>
</svelte:head>

<style>
  .onboarding-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #1a1a1a;
  }

  .content {
    background: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .content p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #666666;
  }

  .sync-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .sync-button {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sync-button:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .sync-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .sync-button.syncing {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .success-message {
    background: #e6f7e6;
    color: #2e7d2e;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .sync-note {
    font-size: 0.9rem;
    color: #888888;
    margin-top: 0.5rem;
  }

  @media (prefers-color-scheme: dark) {
    h1 {
      color: #f0f0f0;
    }

    .content {
      background: #2a2a2a;
      color: #f0f0f0;
    }

    .content p {
      color: #cccccc;
    }

    .error-message {
      background: #3a1515;
      color: #ff6b6b;
    }

    .success-message {
      background: #1a3a1a;
      color: #6bc26b;
    }

    .sync-note {
      color: #aaaaaa;
    }
  }
</style>
