<script lang="ts">
import { Compass, Minus, Plus } from "@lucide/svelte";
import type maplibregl from "maplibre-gl";
import { Button } from "$lib/components/ui/button";

let { map }: { map: maplibregl.Map | undefined } = $props();

function zoomIn() {
  map?.zoomIn();
}

function zoomOut() {
  map?.zoomOut();
}

function resetBearing() {
  map?.resetNorthPitch();
}
</script>

<div class="flex flex-col gap-0.5 bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-md shadow-lg border border-black/10 dark:border-white/20 p-0.5">
  <Button
    variant="ghost"
    size="icon"
    class="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
    onclick={zoomIn}
    aria-label="Zoom in"
  >
    <Plus class="h-3 w-3" />
  </Button>

  <Button
    variant="ghost"
    size="icon"
    class="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
    onclick={zoomOut}
    aria-label="Zoom out"
  >
    <Minus class="h-3 w-3" />
  </Button>

  <div class="h-px bg-black/10 dark:bg-white/20 my-0.5"></div>

  <Button
    variant="ghost"
    size="icon"
    class="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
    onclick={resetBearing}
    aria-label="Reset bearing"
  >
    <Compass class="h-3 w-3" />
  </Button>
</div>
