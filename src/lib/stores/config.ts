import { writable } from "svelte/store";
import type { Config } from "../types.js";

export const config = writable<Config>({
	mapStyle:
		"https://api.maptiler.com/maps/satellite/style.json?key=8Uqpw3E0b3ZQpe36fW7y", // TODO: Load API key from environment variable
	pmtilesUrl: "https://kreed.org/strava/i351926.pmtiles", // TODO: Make this configurable per athlete
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
