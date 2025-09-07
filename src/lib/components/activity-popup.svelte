<script lang="ts">
import { Activity, ExternalLink, X } from "@lucide/svelte";
import type maplibregl from "maplibre-gl";
import { Popup } from "svelte-maplibre-gl";
import { Button } from "$lib/components/ui/button";
import type { ActivityProperties } from "$lib/types.js";

let { handleClick = $bindable<((e: maplibregl.MapLayerMouseEvent) => void) | undefined>() } = $props();

// Popup state
let isOpen = $state(false);
let lngLat = $state<maplibregl.LngLatLike>({ lng: 0, lat: 0 });
let properties = $state<ActivityProperties | null>(null);

// Set the click handler after component initialization
handleClick = (e: maplibregl.MapLayerMouseEvent) => {
  if (e.features?.[0]?.properties) {
    properties = e.features[0].properties as ActivityProperties;
    lngLat = e.lngLat;
    isOpen = true;
  }
};
</script>

{#if isOpen && properties}
	<Popup
		lnglat={lngLat}
		bind:open={isOpen}
		closeButton={false}
		closeOnClick={true}
		anchor="bottom"
	>
		<div class="p-3 rounded-md border backdrop-blur-md text-sm shadow-md border-black/10 bg-white/60 text-black dark:border-white/20 dark:bg-black/20 dark:text-white">
			<div class="flex items-start justify-between mb-2">
				<h3 class="flex items-center gap-1.5 text-sm font-semibold">
					<Activity class="h-3.5 w-3.5" />
					{properties.name || "Unnamed Activity"}
				</h3>
				<button
					onclick={() => isOpen = false}
					class="flex items-center justify-center w-6 h-6 -mt-1 -mr-1 rounded bg-transparent border-0 cursor-pointer transition-all text-black/50 hover:text-black/70 hover:bg-black/10 dark:text-white/50 dark:hover:text-white/70 dark:hover:bg-white/10"
					aria-label="Close"
				>
					<X class="h-3.5 w-3.5" />
				</button>
			</div>

			<div class="space-y-1.5 text-xs">
				<div class="flex items-center gap-2">
					<span class="font-medium">Type:</span>
					<span class="text-black/60 dark:text-white/60">{properties.type || "Unknown"}</span>
				</div>
			</div>

			{#if properties.id}
				<div class="mt-2 pt-2 border-t border-black/10 dark:border-white/20">
					<Button
						class="w-full h-7 text-xs"
						variant="secondary"
						href="https://intervals.icu/activities/{properties.id}"
						target="_blank"
						rel="noopener"
					>
						<ExternalLink class="h-3 w-3 mr-1" />
						View on intervals.icu
					</Button>
				</div>
			{/if}
		</div>
	</Popup>
{/if}

<style>
	/* Override MapLibre's default popup styles */
	:global(.maplibregl-popup-content) {
		padding: 0 !important;
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}
</style>
