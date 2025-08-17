import { writable } from "svelte/store";
import type { Config } from "../types.js";

export const config = writable<Config>({
	mapboxToken:
		"pk.eyJ1Ijoia3JlM2QiLCJhIjoiY2lwcXI2Z204MDZtcmZvbTM2Yjl4bml6aiJ9._nRi_W6qgFwhEYMjxP2OZw",
	mapStyle: "mapbox://styles/kre3d/cmd2b99ga00pi01sr90ly1z3d",
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
