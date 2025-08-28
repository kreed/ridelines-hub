import { env } from "$lib/config/env.js";
import type { Config } from "../types.js";

export const config: Config = {
	mapStyles: [
		{
			id: "dataviz-dark",
			name: "Dark",
			url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${env.MAPTILER_API_KEY}`,
		},
		{
			id: "outdoor-dark",
			name: "Dark Terrain",
			url: `https://api.maptiler.com/maps/outdoor-v2-dark/style.json?key=${env.MAPTILER_API_KEY}`,
		},
		{
			id: "satellite",
			name: "Satellite",
			url: `https://api.maptiler.com/maps/satellite/style.json?key=${env.MAPTILER_API_KEY}`,
		},
	],
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
};
