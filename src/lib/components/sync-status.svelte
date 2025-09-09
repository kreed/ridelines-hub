<script lang="ts">
import { CircleAlert, CircleCheck, Clock, Download, LoaderCircle, MapPin } from "@lucide/svelte";
import * as Alert from "$lib/components/ui/alert";
import { Progress } from "$lib/components/ui/progress";
import type { RouterOutputs } from "$lib/utils/trpc";

type SyncStatus = RouterOutputs["sync"]["status"];

let { syncStatus }: { syncStatus: SyncStatus | null } = $props();

// Type guard to check if status has phases
function hasPhases(
  status: SyncStatus | null,
): status is Extract<SyncStatus, { status: "in_progress" | "completed" | "failed" }> {
  return (
    status !== null && (status.status === "in_progress" || status.status === "completed" || status.status === "failed")
  );
}

function getPhaseIcon(phase: string) {
  switch (phase) {
    case "analyzing":
      return Clock;
    case "downloading":
      return Download;
    case "generating":
      return MapPin;
    default:
      return LoaderCircle;
  }
}

function getPhaseLabel(phase: string) {
  switch (phase) {
    case "analyzing":
      return "Analyzing activities";
    case "downloading":
      return "Downloading activities";
    case "generating":
      return "Generating map tiles";
    default:
      return phase;
  }
}

type PhaseType = {
  status: "pending" | "in_progress" | "completed" | "failed";
  totalToProcess?: number;
  processed?: number;
};

function getPhaseProgress(phase: PhaseType): number | undefined {
  if (phase.status === "completed") return 100;
  if (phase.status === "pending") return 0;

  // For downloading phase, calculate actual progress
  if (phase.totalToProcess && phase.processed !== undefined) {
    return Math.round((phase.processed / phase.totalToProcess) * 100);
  }

  // For in_progress without specific progress, show indeterminate (50%)
  if (phase.status === "in_progress") return undefined;

  return 0;
}
</script>

{#if syncStatus}
  <div class="space-y-4">
    {#if syncStatus.status === "queued"}
      <div class="flex items-center gap-3">
        <LoaderCircle class="h-5 w-5 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Queued for processing...</p>
      </div>
    {:else if hasPhases(syncStatus)}
      <div class="space-y-6">
        {#each ["analyzing", "downloading", "generating"] as phaseKey}
          {@const phase = syncStatus.phases[phaseKey as "analyzing" | "downloading" | "generating"]}
          {#if phase.status !== "pending"}
            {@const PhaseIcon = getPhaseIcon(phaseKey)}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <PhaseIcon
                    class="h-4 w-4 {phase.status === 'completed' ? 'text-green-600' : phase.status === 'in_progress' ? 'text-primary' : 'text-muted-foreground'}"
                  />
                  <span class="text-sm font-medium">{getPhaseLabel(phaseKey)}</span>
                </div>
                {#if phase.status === "completed"}
                  <CircleCheck class="h-4 w-4 text-green-600" />
                {:else if phase.status === "in_progress"}
                  <LoaderCircle class="h-4 w-4 animate-spin text-primary" />
                {/if}
              </div>

              <Progress
                value={getPhaseProgress(phase)}
                max={100}
                class="h-2"
              />

              {#if phaseKey === "analyzing" && "totalActivities" in phase && phase.totalActivities}
                <p class="text-xs text-muted-foreground">
                  Found {phase.totalActivities} activities •
                  {phase.unchangedActivities || 0} unchanged •
                  {phase.changedActivities || 0} to download
                </p>
              {:else if phaseKey === "downloading" && "totalToProcess" in phase && phase.totalToProcess}
                <p class="text-xs text-muted-foreground">
                  {phase.processed || 0} of {phase.totalToProcess} activities
                  {#if phase.failed && phase.failed > 0}
                    • <span class="text-destructive">{phase.failed} failed</span>
                  {/if}
                </p>
              {:else if "message" in phase && phase.message}
                <p class="text-xs text-muted-foreground">{phase.message}</p>
              {/if}
            </div>
          {/if}
        {/each}

        {#if syncStatus.status === "failed" && hasPhases(syncStatus) && syncStatus.error}
          <Alert.Root variant="destructive">
            <CircleAlert class="h-4 w-4" />
            <Alert.Title>Sync failed</Alert.Title>
            <Alert.Description>{syncStatus.error}</Alert.Description>
          </Alert.Root>
        {/if}

        {#if syncStatus.status === "completed"}
          <Alert.Root class="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
            <CircleCheck class="h-4 w-4" />
            <Alert.Title>Sync complete!</Alert.Title>
            <Alert.Description>Your activities have been successfully synced.</Alert.Description>
          </Alert.Root>
        {/if}
      </div>
    {/if}
  </div>
{/if}
