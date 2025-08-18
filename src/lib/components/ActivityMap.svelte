<script lang="ts">
import maplibregl, {
	type DataDrivenPropertyValueSpecification,
	type FilterSpecification,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import { onDestroy, onMount } from "svelte";
import { browser } from "$app/environment";
import { MAPTILER_API_KEY } from "../stores/config.js";
import type {
	ActivityProperties,
	Config,
	FilterableActivityType,
} from "../types.js";
import ErrorMessage from "./ErrorMessage.svelte";
import FilterPanel from "./FilterPanel.svelte";

export let config: Config;

let mapContainer: HTMLDivElement;
let map: maplibregl.Map;
let errorMessage = "";
let showError = false;

// Reactive filter state
let checkedTypes = ["Ride", "Run", "Walk", "Hike", "AlpineSki", "Other"];

// Style management
let currentMapStyle = config.mapStyles[0]?.url || "";

function setupMapLayers() {
	try {
		// Enable globe projection
		map.setProjection({ type: "globe" });

		// Enable terrain rendering
		enableTerrain();

		// Add layers (sources should already exist)
		addActivityLayer();
		setupActivityPopups();
	} catch (error) {
		showErrorMessage(
			`Failed to load activity data: ${(error as Error).message}`,
		);
	}
}

function handleStyleChange(newStyleUrl: string) {
	if (map && newStyleUrl !== currentMapStyle) {
		currentMapStyle = newStyleUrl;
		map.setStyle(newStyleUrl);

		// Re-setup layers after style loads
		map.once("style.load", () => {
			setupMapLayers();
			// Re-apply current filters
			updateMapFilter();
		});
	}
}

onMount(async () => {
	if (browser) {
		await initializeMap();
	}
});

onDestroy(() => {
	if (map) {
		map.remove();
	}
});

async function initializeMap(): Promise<void> {
	try {
		// Add PMTiles protocol
		const protocol = new Protocol();
		maplibregl.addProtocol("pmtiles", protocol.tile);

		map = new maplibregl.Map({
			container: mapContainer,
			style: currentMapStyle,
			center: config.defaultCenter,
			zoom: config.defaultZoom,
			hash: true,
		});

		map.addControl(
			new maplibregl.NavigationControl({
				showCompass: true,
				showZoom: true,
				visualizePitch: true,
			}),
		);

		map.on("style.load", () => {
			// Add sources only once during initial setup
			addTerrainSource();
			addActivitySource();
			setupMapLayers();
		});
	} catch (error) {
		showErrorMessage(`Failed to initialize map: ${(error as Error).message}`);
	}
}

function addActivitySource() {
	map.addSource("activities", {
		type: "vector",
		url: `pmtiles://${config.pmtilesUrl}`,
	});
}

function addActivityLayer(): void {
	const colorExpression = ["match", ["get", "type"]];

	// Add color mappings for each activity type
	Object.entries(config.activityColors).forEach(([type, color]) => {
		if (type !== "default") {
			colorExpression.push(type, color);
		}
	});

	// Add default color
	colorExpression.push(config.activityColors.default);

	map.addLayer({
		id: "activity-lines",
		type: "line",
		source: "activities",
		"source-layer": "activities",
		paint: {
			"line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3],
			"line-color":
				colorExpression as unknown as DataDrivenPropertyValueSpecification<string>,
			"line-opacity": 0.8,
		},
	});
}

function addTerrainSource() {
	map.addSource("terrain", {
		type: "raster-dem",
		url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_API_KEY}`,
		tileSize: 256,
	});
}

function enableTerrain() {
	map.setTerrain({
		source: "terrain",
		exaggeration: 1.5,
	});
}

function setupActivityPopups(): void {
	map.on("mouseenter", "activity-lines", () => {
		map.getCanvas().style.cursor = "pointer";
	});

	map.on("mouseleave", "activity-lines", () => {
		map.getCanvas().style.cursor = "";
	});

	map.on("click", "activity-lines", (e) => {
		const properties: ActivityProperties = e.features?.[0]
			?.properties as ActivityProperties;
		const popupContent = createActivityPopup(properties);

		new maplibregl.Popup().setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
	});
}

function createActivityPopup(properties: ActivityProperties): string {
	const {
		name = "Unnamed Activity",
		type = "Unknown",
		id = "",
		start_date_local = "",
		distance = 0,
		total_elevation_gain = 0,
		elapsed_time = 0,
	} = properties;

	// Format distance (convert from meters to km/miles)
	const distanceKm = (distance / 1000).toFixed(1);
	const distanceMi = (distance * 0.000621371).toFixed(1);

	// Format elevation gain
	const elevationM = Math.round(total_elevation_gain || 0);
	const elevationFt = Math.round((total_elevation_gain || 0) * 3.28084);

	// Format time (convert from seconds to readable format)
	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	// Format date
	const formatDate = (dateStr: string): string => {
		if (!dateStr) return "";
		try {
			return new Date(dateStr).toLocaleDateString();
		} catch {
			return dateStr;
		}
	};

	return `
            <div class="activity-popup">
                <h3>${name}</h3>
                <div class="details">
                    <div><strong>Type:</strong> ${type}</div>
                    ${start_date_local ? `<div><strong>Date:</strong> ${formatDate(start_date_local)}</div>` : ""}
                    ${distance > 0 ? `<div><strong>Distance:</strong> ${distanceKm} km (${distanceMi} mi)</div>` : ""}
                    ${total_elevation_gain > 0 ? `<div><strong>Elevation:</strong> ${elevationM} m (${elevationFt} ft)</div>` : ""}
                    ${elapsed_time > 0 ? `<div><strong>Time:</strong> ${formatTime(elapsed_time)}</div>` : ""}
                </div>
                ${
									id
										? `<div class="link">
                    <a href="https://intervals.icu/activities/${id}" target="_blank" rel="noopener">
                        View on intervals.icu
                    </a>
                </div>`
										: ""
								}
            </div>
        `;
}

function showErrorMessage(message: string): void {
	errorMessage = message;
	showError = true;
	console.error(message);
}

// Reactive filter updates
$: if (map && checkedTypes) {
	updateMapFilter();
}

function updateMapFilter(): void {
	if (!map || !map.isStyleLoaded()) return;

	if (checkedTypes.length === 0) {
		map.setFilter("activity-lines", ["==", "type", ""]);
		return;
	}

	const hasOtherChecked = checkedTypes.includes("Other");
	const mainTypes = checkedTypes.filter((type) => type !== "Other");

	let filter = [];

	if (hasOtherChecked && mainTypes.length > 0) {
		filter = [
			"any",
			["in", "type", ...mainTypes],
			["!", ["in", "type", ...config.activityTypes]],
		];
	} else if (hasOtherChecked) {
		filter = ["!", ["in", "type", ...config.activityTypes]];
	} else {
		filter = ["in", "type", ...mainTypes];
	}

	map.setFilter("activity-lines", filter as unknown as FilterSpecification);
}
</script>

<div class="map-container">
    <div bind:this={mapContainer} class="map"></div>
    <FilterPanel 
        activityTypes={[...config.activityTypes, 'Other'] as FilterableActivityType[]}
        bind:checkedTypes
        mapStyles={config.mapStyles}
        currentStyle={currentMapStyle}
        onStyleChange={handleStyleChange}
    />
    <ErrorMessage bind:show={showError} message={errorMessage} />
</div>

<style>
    .map-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .map {
        width: 100%;
        height: 100%;
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
