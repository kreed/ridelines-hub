<script lang="ts">
import { PMTilesProtocol } from "@svelte-maplibre-gl/pmtiles";
import { createQuery } from "@tanstack/svelte-query";
import maplibregl from "maplibre-gl";
import { useClerkContext } from "svelte-clerk";
import { LineLayer, MapLibre, Projection, RasterDEMTileSource, Terrain, VectorTileSource } from "svelte-maplibre-gl";
import { useActivityFilter } from "$lib/composables/useActivityFilter.svelte.js";
import { useErrorToast } from "$lib/composables/useErrorToast.svelte.js";
import { useMapStyle } from "$lib/composables/useMapStyle.svelte.js";
import type { Config } from "$lib/types.js";
import { trpc } from "$lib/utils/trpc";
import SiteHeader from "../site-header.svelte";
import ActivityPopup from "./activity-popup.svelte";
import ActivityTypeFilter from "./activity-type-filter.svelte";
import MapAttribution from "./map-attribution.svelte";
import MapNavigationControl from "./map-navigation-control.svelte";
import MapStyleSelector from "./map-style-selector.svelte";

let { config }: { config: Config } = $props();

const clerk = useClerkContext();

// Query user info (provides PMTiles URL)
const userQuery = createQuery(() => ({
  queryKey: ["user.pmtiles", clerk.user?.id],
  queryFn: () => trpc.user.pmtiles.query(),
  staleTime: 60_000,
  enabled: Boolean(clerk.user?.id),
}));

const pmtilesUrl = $derived(userQuery.data ?? null);
const mapStyle = useMapStyle(config);
const activityFilter = useActivityFilter(config);

// Cursor state for hover effects
let cursor = $state<string | undefined>(undefined);

// Surface query errors with persistent toast
useErrorToast(() => userQuery.isError, "Failed to load activity data.");

// Log errors to console
$effect(() => {
  if (userQuery.isError) {
    console.error("Failed to load activity data.", userQuery.error);
  }
});

// Activity line color expression
const getLineColor = () => {
  const colorExpression = ["match", ["get", "type"]];

  // Add color mappings for each activity type
  Object.entries(config.activityColors).forEach(([type, color]) => {
    if (type !== "default") {
      colorExpression.push(type, color);
    }
  });

  // Add default color
  colorExpression.push(config.activityColors.default);
  return colorExpression;
};

// Get popup handler from child component
let popupHandleClick = $state<((e: maplibregl.MapLayerMouseEvent) => void) | undefined>(undefined);

// Map instance reference
let mapInstance = $state<maplibregl.Map | undefined>();
</script>

<div class="absolute inset-0">
	<!-- Add PMTiles Protocol globally -->
	<PMTilesProtocol />

	<MapLibre
		style={mapStyle.currentStyleUrl}
		center={config.defaultCenter}
		zoom={config.defaultZoom}
		hash={true}
		class="w-full h-full bg-black"
		{cursor}
		attributionControl={false}
		bind:map={mapInstance}
	>
		<!-- Globe Projection -->
		<Projection type="globe" />

		<!-- Terrain Source and Configuration -->
		<RasterDEMTileSource
			id="terrain"
			{...mapStyle.getTerrainSource()}
		/>
		<Terrain source="terrain" exaggeration={1.5} />

		{#if pmtilesUrl}
			<!-- Activity Data Source -->
			<VectorTileSource
				id="activities"
				url={`pmtiles://${pmtilesUrl}`}
			>
				<!-- Activity Lines Layer -->
				<LineLayer
					id="activity-lines"
					sourceLayer="activities"
					filter={activityFilter.getMapFilter() as maplibregl.FilterSpecification}
					paint={{
						"line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3] as maplibregl.ExpressionSpecification,
						"line-color": getLineColor() as maplibregl.ExpressionSpecification,
						"line-opacity": 0.8,
					}}
				/>
				<!-- Invisible click target layer with wider lines for easier clicking -->
				<LineLayer
					id="activity-lines-clickable"
					sourceLayer="activities"
					filter={activityFilter.getMapFilter() as maplibregl.FilterSpecification}
					paint={{
						"line-width": ["interpolate", ["linear"], ["zoom"], 10, 8, 16, 15] as maplibregl.ExpressionSpecification,
						"line-color": "transparent",
						"line-opacity": 0,
					}}
					onmousemove={() => (cursor = "pointer")}
					onmouseleave={() => (cursor = undefined)}
					onclick={popupHandleClick}
				/>
			</VectorTileSource>
		{/if}
		<ActivityPopup bind:handleClick={popupHandleClick} />
	</MapLibre>

	<!-- Header overlay using SiteHeader component -->
	<div class="absolute top-0 inset-x-0 z-50">
		<SiteHeader variant="glass">
			<div class="flex flex-wrap gap-2">
				<MapStyleSelector
					mapStyles={config.mapStyles}
					currentStyle={mapStyle.currentStyleUrl}
					onStyleChange={mapStyle.changeStyle}
				/>
				<ActivityTypeFilter
					activityTypes={activityFilter.getActivityTypes()}
					bind:checkedTypes={activityFilter.checkedTypes}
				/>
			</div>
		</SiteHeader>
	</div>

	<!-- Bottom Left -->
	<div class="absolute bottom-3 left-3 z-10">
		<MapNavigationControl map={mapInstance} />
	</div>

	<!-- Bottom Right -->
	<div class="absolute bottom-0 right-0 z-10">
		<MapAttribution />
	</div>
</div>
