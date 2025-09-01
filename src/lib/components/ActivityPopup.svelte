<script lang="ts">
import type maplibregl from "maplibre-gl";
import { Popup } from "svelte-maplibre-gl";
import type { ActivityProperties } from "$lib/types.js";

let {
  handleClick = $bindable<((e: maplibregl.MapLayerMouseEvent) => void) | undefined>(),
}: {
  handleClick?: ((e: maplibregl.MapLayerMouseEvent) => void) | undefined;
} = $props();

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

// Format helpers
const formatDistance = (meters: number) => ({
  km: (meters / 1000).toFixed(1),
  mi: (meters * 0.000621371).toFixed(1),
});

const formatElevation = (meters: number) => ({
  m: Math.round(meters || 0),
  ft: Math.round((meters || 0) * 3.28084),
});

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};
</script>

{#if isOpen && properties}
	<Popup
		lnglat={lngLat}
		bind:open={isOpen}
		closeButton={true}
		closeOnClick={true}
		anchor="bottom"
	>
		<div class="activity-popup">
			<h3>{properties.name || "Unnamed Activity"}</h3>
			<div class="details">
				<div><strong>Type:</strong> {properties.type || "Unknown"}</div>
				{#if properties.start_date_local}
					<div><strong>Date:</strong> {formatDate(properties.start_date_local)}</div>
				{/if}
				{#if properties.distance && properties.distance > 0}
					{@const dist = formatDistance(properties.distance)}
					<div><strong>Distance:</strong> {dist.km} km ({dist.mi} mi)</div>
				{/if}
				{#if properties.total_elevation_gain && properties.total_elevation_gain > 0}
					{@const elev = formatElevation(properties.total_elevation_gain)}
					<div><strong>Elevation:</strong> {elev.m} m ({elev.ft} ft)</div>
				{/if}
				{#if properties.elapsed_time && properties.elapsed_time > 0}
					<div><strong>Time:</strong> {formatTime(properties.elapsed_time)}</div>
				{/if}
			</div>
			{#if properties.id}
				<div class="link">
					<a href="https://intervals.icu/activities/{properties.id}" target="_blank" rel="noopener">
						View on intervals.icu
					</a>
				</div>
			{/if}
		</div>
	</Popup>
{/if}
