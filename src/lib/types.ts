export interface Config {
	mapboxToken: string;
	mapStyle: string;
	pmtilesUrl: string;
	activityTypes: ActivityType[];
	activityColors: Record<string, string>;
	defaultCenter: [number, number];
	defaultZoom: number;
}

export interface ActivityProperties {
	name?: string;
	type?: string;
	id?: string;
	start_date_local?: string;
	distance?: number;
	total_elevation_gain?: number;
	elapsed_time?: number;
}

export type ActivityType = "Ride" | "Run" | "Walk" | "Hike" | "AlpineSki";

export type MapboxExpression = (
	| string
	| number
	| boolean
	| (string | number | boolean)[]
)[];

// Specific type for color expressions - keeping it simple
export type MapboxColorExpression = unknown[];

// Extended types for filter functionality
export type FilterableActivityType = ActivityType | "Other";

// Simple map interface to avoid any
export interface SimpleMap {
	remove(): void;
	addControl(control: unknown): void;
	on(event: string, callback: (e?: unknown) => void): void;
	addSource(id: string, source: unknown): void;
	addLayer(layer: unknown): void;
	fitBounds(
		bounds: [number, number, number, number],
		options?: { padding: number },
	): void;
	setFilter(layerId: string, filter: unknown): void;
	getCanvas(): { style: { cursor: string } };
}
