<script lang="ts">
import { PMTilesProtocol } from "@svelte-maplibre-gl/pmtiles";
import { createQuery } from "@tanstack/svelte-query";
import maplibregl from "maplibre-gl";
import { useClerkContext } from "svelte-clerk";
import {
  LineLayer,
  MapLibre,
  NavigationControl,
  Projection,
  RasterDEMTileSource,
  Terrain,
  VectorTileSource,
} from "svelte-maplibre-gl";
import { useActivityFilter } from "$lib/composables/useActivityFilter.svelte.js";
import { useMapStyle } from "$lib/composables/useMapStyle.svelte.js";
import type { Config } from "$lib/types.js";
import { trpc } from "$lib/utils/trpc";
import ActivityPopup from "./ActivityPopup.svelte";
import ActivityTypeFilter from "./activity-type-filter.svelte";
import ErrorMessage from "./ErrorMessage.svelte";
import MapStyleSelector from "./map-style-selector.svelte";

let { config }: { config: Config } = $props();

const clerk = useClerkContext();

// Query user info (provides PMTiles URL)
const userQuery = createQuery(() => ({
  queryKey: ["user.pmtiles", clerk.user?.id],
  queryFn: () => trpc.user.pmtiles.query(),
  staleTime: 60_000,
}));

const pmtilesUrl = $derived(userQuery.data ?? null);
const mapStyle = useMapStyle(config);
const activityFilter = useActivityFilter(config);

// Error handling state
let errorMessage = $state("");

// Cursor state for hover effects
let cursor = $state<string | undefined>(undefined);

// Surface query errors
$effect(() => {
  if (userQuery.isError) {
    errorMessage = "Failed to load activity data.";
    console.error(errorMessage, userQuery.error);
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
</script>

<div class="map-container">
	<!-- Add PMTiles Protocol globally -->
	<PMTilesProtocol />

	<MapLibre
		style={mapStyle.currentStyleUrl}
		center={config.defaultCenter}
		zoom={config.defaultZoom}
		hash={true}
		class="map"
		{cursor}
	>
		<!-- Globe Projection -->
		<Projection type="globe" />

		<!-- Navigation Controls -->
		<NavigationControl showCompass showZoom visualizePitch />

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

	<!-- Map Controls -->
	<div class="absolute top-3 left-3 z-10 flex flex-row gap-2">
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

	<ErrorMessage show={!!errorMessage} message={errorMessage} />
</div>

<style>
	.map-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	:global(.map) {
		width: 100%;
		height: 100%;
		background-color: #000000;
	}

	:global(.maplibregl-popup-content) {
		padding: 15px;
		border-radius: 5px;
	}

	:global(.activity-popup) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		line-height: 1.4;
	}

	:global(.activity-popup h3) {
		margin: 0 0 8px 0;
		color: #333;
		font-size: 14px;
		font-weight: 600;
	}

	:global(.activity-popup .details) {
		margin: 8px 0;
		font-size: 12px;
		color: #666;
	}

	:global(.activity-popup .link) {
		margin-top: 10px;
	}

	:global(.activity-popup a) {
		display: inline-block;
		background: #3386c0;
		color: white;
		text-decoration: none;
		padding: 6px 12px;
		border-radius: 3px;
		font-size: 11px;
		font-weight: 600;
		transition: background-color 0.2s ease;
	}

	:global(.activity-popup a:hover) {
		background: #4ea0da;
	}
</style>
