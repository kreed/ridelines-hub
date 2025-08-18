import { writable } from "svelte/store";
import type { Config } from "../types.js";

// TODO: Load API key from environment variable
export const MAPTILER_API_KEY = "8Uqpw3E0b3ZQpe36fW7y";

export const config = writable<Config>({
	mapStyles: [
		{
			id: "outdoor-dark",
			name: "Outdoor Dark",
			url: `https://api.maptiler.com/maps/outdoor-v2-dark/style.json?key=${MAPTILER_API_KEY}`,
		},
		{
			id: "satellite",
			name: "Satellite",
			url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
		},
		{
			id: "dataviz-dark",
			name: "Dataviz Dark",
			url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_API_KEY}`,
		},
	],
	pmtilesUrl: "https://ridelines.xyz/activities/i351926.pmtiles", // TODO: Make this configurable per athlete
	activityTypes: ["Ride", "Run", "Walk", "Hike", "AlpineSki"] as const,
	activityColors: {
		Ride: "#14affc",
		Run: "#4FFFB0",
		Walk: "#fb139c",
		Hike: "#fb139c",
		AlpineSki: "#984ea3",
		default: "#ffff33",
	},
	defaultCenter: [-98.583, 39.833],
	defaultZoom: 4,
});
