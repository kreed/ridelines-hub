<script lang="ts">
import { Check, ChevronDown, Layers } from "@lucide/svelte";
import { mode } from "mode-watcher";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
import type { MapStyle } from "../types.js";
import MapDropdownTrigger from "./map-dropdown-trigger.svelte";

let {
  mapStyles = [],
  currentStyle = "",
  onStyleChange,
}: {
  mapStyles?: MapStyle[];
  currentStyle?: string;
  onStyleChange: (styleUrl: string) => void;
} = $props();

// Get theme-aware style URL
function getThemeAwareStyleUrl(style: MapStyle): string {
  return mode.current === "dark" ? style.darkUrl : style.lightUrl;
}

// Update style when theme changes
$effect(() => {
  const currentStyleData = mapStyles.find((s) => s.lightUrl === currentStyle || s.darkUrl === currentStyle);
  if (currentStyleData) {
    const newUrl = getThemeAwareStyleUrl(currentStyleData);
    if (newUrl !== currentStyle) {
      onStyleChange(newUrl);
    }
  }
});

const currentStyleData = $derived(
  mapStyles.find((s) => s.lightUrl === currentStyle || s.darkUrl === currentStyle) || mapStyles[0],
);
</script>

<DropdownMenu.Root>
  <MapDropdownTrigger>
    <div class="flex items-center gap-2">
      <Layers class="h-4 w-4" />
      <span>{currentStyleData?.name || 'Select map style'}</span>
    </div>
    <ChevronDown class="h-4 w-4" />
  </MapDropdownTrigger>
  <DropdownMenu.Content class="w-48">
    {#each mapStyles as style}
      <DropdownMenu.Item
        onSelect={() => onStyleChange(getThemeAwareStyleUrl(style))}
        class="flex items-center justify-between"
      >
        <span>{style.name}</span>
        {#if (style.lightUrl === currentStyle) || (style.darkUrl === currentStyle)}
          <Check class="h-4 w-4" />
        {/if}
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
