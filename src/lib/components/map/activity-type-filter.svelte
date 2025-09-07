<script lang="ts">
import { Activity, Check, ChevronDown } from "@lucide/svelte";
import { Badge } from "$lib/components/ui/badge";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
import type { FilterableActivityType } from "$lib/types.js";
import MapDropdownTrigger from "./map-dropdown-trigger.svelte";

let {
  activityTypes = [],
  checkedTypes = $bindable([]),
}: {
  activityTypes?: FilterableActivityType[];
  checkedTypes?: string[];
} = $props();

function toggleType(type: string): void {
  if (checkedTypes.includes(type)) {
    checkedTypes = checkedTypes.filter((t) => t !== type);
  } else {
    checkedTypes = [...checkedTypes, type];
  }
}

const selectedTypesCount = $derived(checkedTypes.length);
const allTypesSelected = $derived(checkedTypes.length === activityTypes.length);
</script>

<DropdownMenu.Root>
  <MapDropdownTrigger>
      <div class="flex items-center gap-2">
        <Activity class="h-4 w-4" />
        <span>Activities</span>
      </div>
      <div class="flex items-center gap-1">
        {#if selectedTypesCount < activityTypes.length}
          <Badge variant="secondary" class="h-5 px-1.5 text-xs">
            {selectedTypesCount}
          </Badge>
        {/if}
        <ChevronDown class="h-4 w-4" />
      </div>
  </MapDropdownTrigger>
  <DropdownMenu.Content class="w-48">
    <DropdownMenu.Item
      onSelect={() => {
        if (allTypesSelected) {
          checkedTypes = [];
        } else {
          checkedTypes = [...activityTypes];
        }
      }}
      class="font-medium"
    >
      {#if allTypesSelected}
        Deselect All
      {:else}
        Select All
      {/if}
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    {#each activityTypes as activityType}
      <DropdownMenu.Item
        onSelect={() => toggleType(activityType)}
        class="flex items-center justify-between"
      >
        <span class="capitalize">{activityType.toLowerCase()}</span>
        {#if checkedTypes.includes(activityType)}
          <Check class="h-4 w-4" />
        {/if}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
