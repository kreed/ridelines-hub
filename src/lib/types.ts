export interface Config {
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

// Extended types for filter functionality
export type FilterableActivityType = ActivityType | "Other";
